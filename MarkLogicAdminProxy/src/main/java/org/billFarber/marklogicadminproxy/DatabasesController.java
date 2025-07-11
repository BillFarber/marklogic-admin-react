package org.billFarber.marklogicadminproxy;

/**
 * Controller for proxying MarkLogic Database Management API endpoints.
 * 
 * API Documentation:
 * https://docs.marklogic.com/REST/management/databases
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
public class DatabasesController {
    @Autowired
    private DatabaseClient databaseClient;

    @Value("${marklogic.host}")
    private String marklogicHost;

    @Value("${marklogic.schema}")
    private String marklogicSchema;

    @GetMapping("/manage/v2/databases")
    public ResponseEntity<String> getDatabases(
            @RequestParam(value = "format", required = false, defaultValue = "json") String format,
            @RequestParam(value = "view", required = false) String view) {
        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/databases")
                    .newBuilder();
            urlBuilder.addQueryParameter("format", format);
            if (view != null) {
                urlBuilder.addQueryParameter("view", view);
            }

            // Build the request
            Request request = new Request.Builder()
                    .url(urlBuilder.build())
                    .get()
                    .addHeader("Accept", "application/json")
                    .build();

            // Execute the request
            Response response = okHttpClient.newCall(request).execute();

            if (response.isSuccessful()) {
                String responseBody = response.body().string();
                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(responseBody);
            } else {
                return ResponseEntity.status(response.code())
                        .body("{\"error\":\"MarkLogic returned status: " + response.code() + "\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(502)
                    .body("{\"error\":\"Failed to proxy to MarkLogic: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/manage/v2/databases/{idOrName}/properties")
    public ResponseEntity<String> getDatabaseProperties(
            @PathVariable String idOrName,
            @RequestParam(value = "format", required = false, defaultValue = "json") String format) {

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
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/databases/" + idOrName
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
}
