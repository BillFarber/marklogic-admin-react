package org.billFarber.marklogicadminproxy;

/**
 * Controller for proxying MarkLogic Role Management API endpoints.
 * 
 * API Documentation:
 * https://docs.marklogic.com/REST/GET/manage/v2/roles
 * https://docs.marklogic.com/REST/GET/manage/v2/roles/[id-or-name]/properties
 * 
 * This resource address returns data about the Roles in the Security database.
 * The data returned depends on the setting of the format request parameter.
 * 
 * Supported parameters for /roles:
 * - format: The format of the returned data (html, json, xml - default)
 * 
 * Supported parameters for /roles/{id|name}/properties:
 * - format: The format of the returned data (json, xml - default)
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RolesController {
    @Autowired
    private DatabaseClient databaseClient;

    @Value("${marklogic.host}")
    private String marklogicHost;

    @Value("${marklogic.schema}")
    private String marklogicSchema;

    @GetMapping("/manage/v2/roles")
    public ResponseEntity<String> getRoles(
            @RequestParam(value = "format", required = false, defaultValue = "xml") String format) {

        // Handle null format and set default
        if (format == null) {
            format = "xml";
        }

        // Validate format parameter
        if (!format.equals("json") && !format.equals("xml") && !format.equals("html")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid format parameter. Must be 'json', 'xml', or 'html'\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/roles")
                    .newBuilder();

            urlBuilder.addQueryParameter("format", format);

            // Build the request with appropriate Accept header based on format
            String acceptHeader;
            switch (format) {
                case "json":
                    acceptHeader = "application/json";
                    break;
                case "xml":
                    acceptHeader = "application/xml";
                    break;
                case "html":
                    acceptHeader = "text/html";
                    break;
                default:
                    acceptHeader = "application/xml";
            }

            Request request = new Request.Builder()
                    .url(urlBuilder.build())
                    .get()
                    .addHeader("Accept", acceptHeader)
                    .build();

            // Execute the request
            Response response = okHttpClient.newCall(request).execute();

            if (response.isSuccessful()) {
                String responseBody = response.body().string();

                // Set appropriate content type based on format
                MediaType contentType;
                switch (format) {
                    case "json":
                        contentType = MediaType.APPLICATION_JSON;
                        break;
                    case "xml":
                        contentType = MediaType.APPLICATION_XML;
                        break;
                    case "html":
                        contentType = MediaType.TEXT_HTML;
                        break;
                    default:
                        contentType = MediaType.APPLICATION_XML;
                }

                return ResponseEntity.ok().contentType(contentType).body(responseBody);
            } else {
                return ResponseEntity.status(response.code())
                        .body("{\"error\":\"MarkLogic returned status: " + response.code() + "\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(502)
                    .body("{\"error\":\"Failed to proxy to MarkLogic: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/manage/v2/roles/{idOrName}/properties")
    public ResponseEntity<String> getRoleProperties(
            @PathVariable String idOrName,
            @RequestParam(value = "format", required = false, defaultValue = "xml") String format) {

        // Handle null format and set default
        if (format == null) {
            format = "xml";
        }

        // Validate format parameter - role properties only supports json and xml (no
        // html)
        if (!format.equals("json") && !format.equals("xml")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid format parameter. Must be 'json' or 'xml'\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/roles/" + idOrName
                            + "/properties")
                    .newBuilder();

            urlBuilder.addQueryParameter("format", format);

            HttpUrl url = urlBuilder.build();

            // Create and execute the request with appropriate Accept header
            String acceptHeader = format.equals("json") ? "application/json" : "application/xml";

            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .addHeader("Accept", acceptHeader)
                    .build();

            try (Response response = okHttpClient.newCall(request).execute()) {
                if (response.body() == null) {
                    return ResponseEntity.status(502)
                            .body("{\"error\":\"No response from MarkLogic server\"}");
                }

                String responseBody = response.body().string();

                if (response.isSuccessful()) {
                    // Set appropriate content type based on format
                    MediaType contentType = format.equals("json") ? MediaType.APPLICATION_JSON
                            : MediaType.APPLICATION_XML;
                    return ResponseEntity.ok().contentType(contentType).body(responseBody);
                } else {
                    return ResponseEntity.status(response.code())
                            .body("{\"error\":\"MarkLogic returned status: " + response.code() + "\"}");
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(502)
                    .body("{\"error\":\"Failed to proxy to MarkLogic: " + e.getMessage() + "\"}");
        }
    }
}
