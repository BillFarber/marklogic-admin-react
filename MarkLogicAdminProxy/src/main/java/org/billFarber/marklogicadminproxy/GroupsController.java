package org.billFarber.marklogicadminproxy;

/**
 * Controller for proxying MarkLogic Groups Management API endpoints.
 * 
 * API Documentation:
 * https://docs.marklogic.com/REST/GET/manage/v2/groups
 * https://docs.marklogic.com/REST/GET/manage/v2/groups/[id-or-name]/properties
 * 
 * Supported parameters and their valid values can be found in the official
 * MarkLogic Management API documentation.
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
public class GroupsController {
    @Autowired
    private DatabaseClient databaseClient;

    @Value("${marklogic.host}")
    private String marklogicHost;

    @Value("${marklogic.schema}")
    private String marklogicSchema;

    @GetMapping("/manage/v2/groups")
    public ResponseEntity<String> getGroups(
            @RequestParam(value = "format", required = false, defaultValue = "json") String format,
            @RequestParam(value = "view", required = false) String view) {

        // Handle null format (happens in unit tests)
        if (format == null) {
            format = "json";
        }

        // Validate format parameter
        if (!format.equals("json") && !format.equals("xml") && !format.equals("html")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid format parameter. Must be 'json', 'xml', or 'html'\"}");
        }

        // Validate view parameter if provided
        if (view != null && !view.equals("schema") && !view.equals("default")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid view parameter. Must be 'schema' or 'default'\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/groups")
                    .newBuilder();
            urlBuilder.addQueryParameter("format", format);
            if (view != null) {
                urlBuilder.addQueryParameter("view", view);
            }

            // Build the request
            Request request = new Request.Builder()
                    .url(urlBuilder.build())
                    .get()
                    .addHeader("Accept", getAcceptHeader(format))
                    .build();

            // Execute the request
            Response response = okHttpClient.newCall(request).execute();

            if (response.isSuccessful()) {
                String responseBody = response.body().string();
                MediaType contentType = getContentType(format);
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

    @GetMapping("/manage/v2/groups/{idOrName}/properties")
    public ResponseEntity<String> getGroupProperties(
            @PathVariable String idOrName,
            @RequestParam(value = "format", required = false, defaultValue = "json") String format) {

        // Handle null format (happens in unit tests)
        if (format == null) {
            format = "json";
        }

        // Validate format parameter
        if (!format.equals("json") && !format.equals("xml")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid format parameter. Must be 'json' or 'xml'\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/groups/" + idOrName
                            + "/properties")
                    .newBuilder();
            urlBuilder.addQueryParameter("format", format);

            // Build the request
            Request request = new Request.Builder()
                    .url(urlBuilder.build())
                    .get()
                    .addHeader("Accept", format.equals("json") ? "application/json" : "application/xml")
                    .build();

            // Execute the request
            Response response = okHttpClient.newCall(request).execute();

            if (response.isSuccessful()) {
                String responseBody = response.body().string();
                MediaType contentType = format.equals("json") ? MediaType.APPLICATION_JSON : MediaType.APPLICATION_XML;
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

    private String getAcceptHeader(String format) {
        switch (format) {
            case "json":
                return "application/json";
            case "xml":
                return "application/xml";
            case "html":
                return "text/html";
            default:
                return "application/json";
        }
    }

    private MediaType getContentType(String format) {
        switch (format) {
            case "json":
                return MediaType.APPLICATION_JSON;
            case "xml":
                return MediaType.APPLICATION_XML;
            case "html":
                return MediaType.TEXT_HTML;
            default:
                return MediaType.APPLICATION_JSON;
        }
    }
}
