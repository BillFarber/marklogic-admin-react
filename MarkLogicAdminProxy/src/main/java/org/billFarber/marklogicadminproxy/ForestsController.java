package org.billFarber.marklogicadminproxy;

import com.marklogic.client.DatabaseClient;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/manage/v2")
public class ForestsController {

    private static final Logger logger = LoggerFactory.getLogger(ForestsController.class);

    @Autowired
    private DatabaseClient databaseClient;

    @Value("${marklogic.host}")
    private String marklogicHost;

    @Value("${marklogic.schema}")
    private String marklogicSchema;

    @GetMapping("/forests")
    public ResponseEntity<String> getForests(
            @RequestParam(value = "format", required = false) String format,
            @RequestParam(value = "view", required = false) String view,
            @RequestParam(value = "database-id", required = false) String databaseId,
            @RequestParam(value = "group-id", required = false) String groupId,
            @RequestParam(value = "host-id", required = false) String hostId,
            @RequestParam(value = "fullrefs", required = false) String fullrefs) {

        logger.info(
                "Received request for forests with parameters - format: {}, view: {}, database-id: {}, group-id: {}, host-id: {}, fullrefs: {}",
                format, view, databaseId, groupId, hostId, fullrefs);

        // Validate format parameter
        if (format != null && !format.equals("json") && !format.equals("xml")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid format parameter. Must be 'json' or 'xml'\"}");
        }

        // Validate view parameter
        if (view != null && !isValidView(view)) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid view parameter. Must be one of: schema, counts, storage, metrics, default, status\"}");
        }

        // Validate fullrefs parameter
        if (fullrefs != null && !fullrefs.equals("true") && !fullrefs.equals("false")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid fullrefs parameter. Must be 'true' or 'false'\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic Management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/forests")
                    .newBuilder();

            // Add valid query parameters
            if (format != null) {
                urlBuilder.addQueryParameter("format", format);
            }
            if (view != null) {
                urlBuilder.addQueryParameter("view", view);
            }
            if (databaseId != null) {
                urlBuilder.addQueryParameter("database-id", databaseId);
            }
            if (groupId != null) {
                urlBuilder.addQueryParameter("group-id", groupId);
            }
            if (hostId != null) {
                urlBuilder.addQueryParameter("host-id", hostId);
            }
            if (fullrefs != null) {
                urlBuilder.addQueryParameter("fullrefs", fullrefs);
            }

            HttpUrl url = urlBuilder.build();
            logger.debug("Making request to MarkLogic: {}", url);

            // Create and execute the request
            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .build();

            try (Response response = okHttpClient.newCall(request).execute()) {
                if (response.body() == null) {
                    logger.error("Received null response body from MarkLogic");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("No response from MarkLogic server");
                }

                String responseBody = response.body().string();
                logger.debug("MarkLogic response status: {}, body length: {}",
                        response.code(), responseBody.length());

                if (response.isSuccessful()) {
                    return ResponseEntity.ok()
                            .header("Content-Type", response.header("Content-Type", "application/json"))
                            .body(responseBody);
                } else {
                    logger.error("MarkLogic returned error: {} - {}", response.code(), responseBody);
                    return ResponseEntity.status(response.code()).body(responseBody);
                }
            }

        } catch (IOException e) {
            logger.error("Error communicating with MarkLogic", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error communicating with MarkLogic: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error in forests endpoint", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    private boolean isValidView(String view) {
        return view.equals("schema") || view.equals("counts") || view.equals("storage") ||
                view.equals("metrics") || view.equals("default") || view.equals("status");
    }
}
