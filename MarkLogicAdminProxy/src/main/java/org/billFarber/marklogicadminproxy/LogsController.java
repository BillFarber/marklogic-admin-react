package org.billFarber.marklogicadminproxy;

/**
 * Controller for proxying MarkLogic Logs Management API endpoints.
 * 
 * API Documentation:
 * https://docs.marklogic.com/REST/GET/manage/v2/logs
 * 
 * Returns the content of server log files with support for filtering by time range,
 * regex patterns, and different output formats.
 * 
 * Supported parameters and their valid values:
 * - format: json, xml, html, text (default: xml based on Accept header)
 * - filename: The log file to be returned (required)
 * - host: The host from which to return the log data
 * - start: The start time for the log data (only for error logs)
 * - end: The end time for the log data (only for error logs)
 * - regex: Filters the log data based on a regular expression (only for error logs)
 * 
 * Note: start, end, and regex parameters are only supported for error logs.
 * Access and audit logs will return 400 Bad Request if these parameters are used.
 */

import com.marklogic.client.DatabaseClient;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.HttpUrl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogsController {

    @Autowired
    private DatabaseClient databaseClient;

    @Value("${marklogic.host}")
    private String marklogicHost;

    @Value("${marklogic.schema}")
    private String marklogicSchema;

    @GetMapping("/manage/v2/logs")
    public ResponseEntity<String> getLogs(
            @RequestParam(value = "format", required = false) String format,
            @RequestParam(value = "filename", required = false) String filename,
            @RequestParam(value = "host", required = false) String host,
            @RequestParam(value = "start", required = false) String start,
            @RequestParam(value = "end", required = false) String end,
            @RequestParam(value = "regex", required = false) String regex) {

        // Validate format parameter if provided
        if (format != null && !format.equals("json") && !format.equals("xml") &&
                !format.equals("html") && !format.equals("text")) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\": \"Invalid format parameter. Must be one of: json, xml, html, text\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            HttpUrl.Builder urlBuilder = HttpUrl.parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/logs")
                    .newBuilder();

            // Add filename parameter only if provided
            if (filename != null && !filename.trim().isEmpty()) {
                urlBuilder.addQueryParameter("filename", filename);
            }

            // Add optional parameters if provided
            if (format != null) {
                urlBuilder.addQueryParameter("format", format);
            }
            if (host != null) {
                urlBuilder.addQueryParameter("host", host);
            }
            if (start != null) {
                urlBuilder.addQueryParameter("start", start);
            }
            if (end != null) {
                urlBuilder.addQueryParameter("end", end);
            }
            if (regex != null) {
                urlBuilder.addQueryParameter("regex", regex);
            }

            String url = urlBuilder.build().toString();

            Request request = new Request.Builder()
                    .url(url)
                    .build();

            Response response = okHttpClient.newCall(request).execute();
            String responseBody = response.body().string();

            // Determine appropriate content type based on format parameter or response
            MediaType contentType = MediaType.APPLICATION_XML; // Default
            if (format != null) {
                switch (format.toLowerCase()) {
                    case "json":
                        contentType = MediaType.APPLICATION_JSON;
                        break;
                    case "xml":
                        contentType = MediaType.APPLICATION_XML;
                        break;
                    case "html":
                        contentType = MediaType.TEXT_HTML;
                        break;
                    case "text":
                        contentType = MediaType.TEXT_PLAIN;
                        break;
                }
            }

            if (response.isSuccessful()) {
                return ResponseEntity.ok()
                        .contentType(contentType)
                        .body(responseBody);
            } else {
                // Pass through MarkLogic error responses with appropriate status codes
                org.springframework.http.HttpStatus httpStatus;
                switch (response.code()) {
                    case 400:
                        httpStatus = org.springframework.http.HttpStatus.BAD_REQUEST;
                        break;
                    case 401:
                        httpStatus = org.springframework.http.HttpStatus.UNAUTHORIZED;
                        break;
                    case 404:
                        httpStatus = org.springframework.http.HttpStatus.NOT_FOUND;
                        break;
                    default:
                        httpStatus = org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
                        break;
                }

                return ResponseEntity.status(httpStatus)
                        .contentType(contentType)
                        .body(responseBody);
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\": \"Failed to retrieve logs: " + e.getMessage() + "\"}");
        }
    }
}
