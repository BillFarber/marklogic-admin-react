package org.billFarber.marklogicadminproxy;

/**
 * Controller for proxying MarkLogic Hosts Management API endpoints.
 * 
 * API Documentation:
 * https://docs.marklogic.com/REST/GET/manage/v2/hosts
 * https://docs.marklogic.com/REST/GET/manage/v2/hosts/[id-or-name]/properties
 * 
 * Supported parameters and their valid values can be found in the official
 * MarkLogic Management API documentation.
 */

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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/manage/v2")
public class HostsController {

    private static final Logger logger = LoggerFactory.getLogger(HostsController.class);

    @Autowired
    private DatabaseClient databaseClient;

    @Value("${marklogic.host}")
    private String marklogicHost;

    @Value("${marklogic.schema}")
    private String marklogicSchema;

    /**
     * Retrieve information about the hosts in a cluster.
     * 
     * @param format  The format of the returned data. Can be either html, json, or
     *                xml (default).
     * @param groupId Specifies to return only the hosts in the specified group.
     * @param view    A specific view of the returned data. Can be either schema,
     *                status, metrics, or default.
     * @return ResponseEntity containing the hosts information
     */
    @GetMapping("/hosts")
    public ResponseEntity<String> getHosts(
            @RequestParam(value = "format", required = false) String format,
            @RequestParam(value = "group-id", required = false) String groupId,
            @RequestParam(value = "view", required = false) String view) {

        logger.info(
                "Received request for hosts with parameters - format: {}, group-id: {}, view: {}",
                format, groupId, view);

        // Validate format parameter
        if (format != null && !isValidFormat(format)) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid format parameter. Must be 'html', 'json', or 'xml'\"}");
        }

        // Validate view parameter
        if (view != null && !isValidView(view)) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid view parameter. Must be one of: schema, status, metrics, default\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic Management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/hosts")
                    .newBuilder();

            // Add valid query parameters
            if (format != null) {
                urlBuilder.addQueryParameter("format", format);
            }
            if (groupId != null) {
                urlBuilder.addQueryParameter("group-id", groupId);
            }
            if (view != null) {
                urlBuilder.addQueryParameter("view", view);
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
                            .body("{\"error\":\"No response from MarkLogic server\"}");
                }

                String responseBody = response.body().string();

                if (response.isSuccessful()) {
                    logger.debug("Successfully received response from MarkLogic: {}", response.code());

                    // Determine content type based on format
                    MediaType contentType = getContentType(format);
                    return ResponseEntity.ok().contentType(contentType).body(responseBody);
                } else {
                    logger.error("MarkLogic returned error status: {} with body: {}", response.code(), responseBody);
                    return ResponseEntity.status(response.code())
                            .body("{\"error\":\"MarkLogic returned status: " + response.code() + "\"}");
                }
            }
        } catch (IOException e) {
            logger.error("IOException while communicating with MarkLogic", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("{\"error\":\"Failed to proxy to MarkLogic: " + e.getMessage() + "\"}");
        } catch (Exception e) {
            logger.error("Unexpected error while proxying to MarkLogic", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Unexpected error: " + e.getMessage() + "\"}");
        }
    }

    /**
     * Get the current state of modifiable properties of the specified host.
     * 
     * @param idOrName The host ID or name
     * @param format   The format of the returned data. Can be either json or xml
     *                 (default).
     * @return ResponseEntity containing the host properties
     */
    @GetMapping("/hosts/{idOrName}/properties")
    public ResponseEntity<String> getHostProperties(
            @PathVariable String idOrName,
            @RequestParam(value = "format", required = false) String format) {

        logger.info("Received request for host properties - idOrName: {}, format: {}", idOrName, format);

        // Validate format parameter (only json and xml are supported for properties
        // endpoint)
        if (format != null && !format.equals("json") && !format.equals("xml")) {
            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Invalid format parameter. Must be 'json' or 'xml'\"}");
        }

        try {
            // Get the underlying OkHttpClient from the MarkLogic DatabaseClient
            OkHttpClient okHttpClient = (OkHttpClient) databaseClient.getClientImplementation();

            // Build the URL for the MarkLogic Management API
            HttpUrl.Builder urlBuilder = HttpUrl
                    .parse(marklogicSchema + "://" + marklogicHost + ":8002/manage/v2/hosts/" + idOrName
                            + "/properties")
                    .newBuilder();

            // Add format parameter if specified
            if (format != null) {
                urlBuilder.addQueryParameter("format", format);
            }

            HttpUrl url = urlBuilder.build();
            logger.debug("Making request to MarkLogic: {}", url);

            // Create and execute the request
            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .addHeader("Accept",
                            format != null && format.equals("xml") ? "application/xml" : "application/json")
                    .build();

            try (Response response = okHttpClient.newCall(request).execute()) {
                if (response.body() == null) {
                    logger.error("Received null response body from MarkLogic");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("{\"error\":\"No response from MarkLogic server\"}");
                }

                String responseBody = response.body().string();

                if (response.isSuccessful()) {
                    logger.debug("Successfully received response from MarkLogic: {}", response.code());

                    // Determine content type based on format (default to JSON if not specified)
                    MediaType contentType = (format != null && format.equals("xml")) ? MediaType.APPLICATION_XML
                            : MediaType.APPLICATION_JSON;
                    return ResponseEntity.ok().contentType(contentType).body(responseBody);
                } else {
                    logger.error("MarkLogic returned error status: {} with body: {}", response.code(), responseBody);
                    return ResponseEntity.status(response.code())
                            .body("{\"error\":\"MarkLogic returned status: " + response.code() + "\"}");
                }
            }
        } catch (IOException e) {
            logger.error("IOException while communicating with MarkLogic", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("{\"error\":\"Failed to proxy to MarkLogic: " + e.getMessage() + "\"}");
        } catch (Exception e) {
            logger.error("Unexpected error while proxying to MarkLogic", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Unexpected error: " + e.getMessage() + "\"}");
        }
    }

    /**
     * Validates the format parameter for the /hosts endpoint.
     * 
     * @param format the format parameter value
     * @return true if valid, false otherwise
     */
    private boolean isValidFormat(String format) {
        return format.equals("html") || format.equals("json") || format.equals("xml");
    }

    /**
     * Validates the view parameter.
     * 
     * @param view the view parameter value
     * @return true if valid, false otherwise
     */
    private boolean isValidView(String view) {
        return view.equals("schema") || view.equals("status") || view.equals("metrics") || view.equals("default");
    }

    /**
     * Determines the appropriate MediaType based on the format parameter.
     * 
     * @param format the format parameter value
     * @return the appropriate MediaType
     */
    private MediaType getContentType(String format) {
        if (format == null) {
            return MediaType.APPLICATION_JSON; // Default to JSON when format is not specified
        }

        switch (format) {
            case "xml":
                return MediaType.APPLICATION_XML;
            case "html":
                return MediaType.TEXT_HTML;
            case "json":
            default:
                return MediaType.APPLICATION_JSON;
        }
    }
}
