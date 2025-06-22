package org.billFarber.marklogicadminproxy;

/**
 * Controller for proxying MarkLogic Server Management API endpoints.
 * 
 * API Documentation:
 * https://docs.marklogic.com/REST/GET/manage/v2/servers
 * 
 * This resource address returns data about the App Servers in the cluster.
 * The data returned depends on the setting of the view request parameter.
 * The default view provides a summary of the servers.
 * 
 * Supported parameters:
 * - format: The format of the returned data (html, json, xml - default)
 * - group-id: Return only servers in the specified group (by id or name)
 * - view: Specific view (schema, status, metrics, package, default)
 * - fullrefs: If true, full detail for all relationship references (default: false)
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
public class ServersController {
    @Autowired
    private DatabaseClient databaseClient;

    @Value("${marklogic.host}")
    private String marklogicHost;

    @Value("${marklogic.schema}")
    private String marklogicSchema;

    @GetMapping("/manage/v2/servers")
    public ResponseEntity<String> getServers(
            @RequestParam(value = "format", required = false, defaultValue = "json") String format,
            @RequestParam(value = "group-id", required = false) String groupId,
            @RequestParam(value = "view", required = false) String view,
            @RequestParam(value = "fullrefs", required = false) String fullrefs) {

        // Validate format parameter
        if (!format.equals("json") && !format.equals("xml") && !format.equals("html")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid format parameter. Must be 'json', 'xml', or 'html'\"}");
        }

        // Validate view parameter
        if (view != null && !view.trim().isEmpty() && !view.equals("default") && !view.equals("schema")
                && !view.equals("status")
                && !view.equals("metrics") && !view.equals("package")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid view parameter. Must be 'default', 'schema', 'status', 'metrics', or 'package'\"}");
        }

        // Validate fullrefs parameter
        if (fullrefs != null && !fullrefs.trim().isEmpty() && !fullrefs.equals("true") && !fullrefs.equals("false")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid fullrefs parameter. Must be 'true' or 'false'\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/servers")
                    .newBuilder();

            urlBuilder.addQueryParameter("format", format);

            if (groupId != null && !groupId.trim().isEmpty()) {
                urlBuilder.addQueryParameter("group-id", groupId);
            }

            if (view != null && !view.trim().isEmpty()) {
                urlBuilder.addQueryParameter("view", view);
            }

            if (fullrefs != null && !fullrefs.trim().isEmpty()) {
                urlBuilder.addQueryParameter("fullrefs", fullrefs);
            }

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
                    acceptHeader = "application/json";
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
                        contentType = MediaType.APPLICATION_JSON;
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

    @GetMapping("/manage/v2/servers/{idOrName}/properties")
    public ResponseEntity<String> getServerProperties(
            @PathVariable String idOrName,
            @RequestParam(value = "group-id", required = true) String groupId,
            @RequestParam(value = "format", required = false, defaultValue = "json") String format) {

        // Handle null format and set default
        if (format == null) {
            format = "json";
        }

        // Validate format parameter
        if (!format.equals("json") && !format.equals("xml")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid format parameter. Must be 'json' or 'xml'\"}");
        }

        // Validate group-id parameter
        if (groupId == null || groupId.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"group-id parameter is required\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/servers/" + idOrName
                            + "/properties")
                    .newBuilder();
            urlBuilder.addQueryParameter("group-id", groupId);
            urlBuilder.addQueryParameter("format", format);

            HttpUrl url = urlBuilder.build();

            // Create and execute the request
            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .build();

            try (Response response = okHttpClient.newCall(request).execute()) {
                if (response.body() == null) {
                    return ResponseEntity.status(502)
                            .body("{\"error\":\"No response from MarkLogic server\"}");
                }

                String responseBody = response.body().string();

                if (response.isSuccessful()) {
                    // Set appropriate content type based on format
                    MediaType contentType = format.equals("xml") ? MediaType.APPLICATION_XML
                            : MediaType.APPLICATION_JSON;
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
