package org.billFarber.marklogicadminproxy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class LogsControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testGetLogsIntegration_ErrorLog() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/logs?filename=ErrorLog.txt&format=json",
                String.class);

        // Assert
        // This test requires MarkLogic to be running, accessible, and responding
        // successfully
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response is not null
        assertNotNull(response.getBody());
    }

    @Test
    void testGetLogsIntegration_WithDateFilter() {
        // Act - Using date filters which should only work with error logs
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port
                        + "/manage/v2/logs?filename=ErrorLog.txt&format=json&start=2023-01-01T00:00:00",
                String.class);

        // Assert
        // Should either succeed or return 400 if no data matches the criteria
        assertTrue(response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.BAD_REQUEST,
                "Expected OK or Bad Request for date filtered logs. Got: " + response.getStatusCode());

        assertNotNull(response.getBody());
    }

    @Test
    void testGetLogsIntegration_WithRegexFilter() {
        // Act - Using regex filter which should only work with error logs
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/logs?filename=ErrorLog.txt&format=json&regex=ERROR.*",
                String.class);

        // Assert
        // Should either succeed or return 400 if regex filtering not supported for this
        // log type
        assertTrue(response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.BAD_REQUEST,
                "Expected OK or Bad Request for regex filtered logs. Got: " + response.getStatusCode());

        assertNotNull(response.getBody());
    }

    @Test
    void testGetLogsIntegration_AccessLogWithFilter_ShouldFail() {
        // Act - Access logs don't support query parameters according to MarkLogic docs
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/logs?filename=8000_AccessLog.txt&format=json&start=2023-01-01",
                String.class);

        // Assert
        // Should return 400 Bad Request for access logs with query parameters
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode(),
                "Access logs should return 400 when using query parameters. Got: " + response.getStatusCode());

        assertNotNull(response.getBody());
    }

    @Test
    void testGetLogsIntegration_InvalidFilename() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/logs?filename=NonExistentLog.txt&format=json",
                String.class);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode(),
                "Non-existent log file should return 404. Got: " + response.getStatusCode());

        assertNotNull(response.getBody());
    }

    @Test
    void testGetLogsIntegration_MissingFilename() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/logs?format=json",
                String.class);

        // Assert - With optional filename, this should make a call to MarkLogic without
        // filename
        // The actual response depends on what MarkLogic returns, but it shouldn't be a
        // 404 error
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode(),
                "Missing filename should no longer return 404. Got: " + response.getStatusCode());

        assertNotNull(response.getBody());
    }

    @Test
    void testGetLogsIntegration_InvalidFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/logs?filename=ErrorLog.txt&format=invalid",
                String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode(),
                "Invalid format should return 400. Got: " + response.getStatusCode());

        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetLogsIntegration_DifferentFormats() {
        String[] formats = { "json", "xml", "html", "text" };

        for (String format : formats) {
            // Act
            ResponseEntity<String> response = restTemplate.getForEntity(
                    "http://localhost:" + port + "/manage/v2/logs?filename=ErrorLog.txt&format=" + format,
                    String.class);

            // Assert
            assertEquals(HttpStatus.OK, response.getStatusCode(),
                    "Format " + format + " should be valid. Got: " + response.getStatusCode());

            assertNotNull(response.getBody(), "Response body should not be null for format: " + format);

            // Verify content type matches format
            String contentType = response.getHeaders().getContentType().toString();
            switch (format) {
                case "json":
                    assertTrue(contentType.contains("application/json"),
                            "JSON format should return JSON content type. Got: " + contentType);
                    break;
                case "xml":
                    assertTrue(contentType.contains("application/xml"),
                            "XML format should return XML content type. Got: " + contentType);
                    break;
                case "html":
                    assertTrue(contentType.contains("text/html"),
                            "HTML format should return HTML content type. Got: " + contentType);
                    break;
                case "text":
                    assertTrue(contentType.contains("text/plain"),
                            "Text format should return plain text content type. Got: " + contentType);
                    break;
            }
        }
    }

    @Test
    void testGetLogsIntegration_WithHostParameter() {
        // Act - Using host parameter (may or may not be supported depending on
        // MarkLogic setup)
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/logs?filename=ErrorLog.txt&format=json&host=localhost",
                String.class);

        // Assert
        // Should either succeed or return an error depending on MarkLogic configuration
        assertTrue(response.getStatusCode() == HttpStatus.OK ||
                response.getStatusCode() == HttpStatus.BAD_REQUEST ||
                response.getStatusCode() == HttpStatus.NOT_FOUND,
                "Host parameter test should return OK, Bad Request, or Not Found. Got: " + response.getStatusCode());

        assertNotNull(response.getBody());
    }

    @Test
    void testGetLogsIntegration_DefaultXmlFormat() {
        // Act - Test default format (should be XML according to Accept header)
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/logs?filename=ErrorLog.txt",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Default format should work. Got: " + response.getStatusCode());

        assertNotNull(response.getBody());

        // Should default to XML content type
        String contentType = response.getHeaders().getContentType().toString();
        assertTrue(contentType.contains("application/xml"),
                "Default format should return XML content type. Got: " + contentType);
    }

    @Test
    void testGetLogsIntegration_CombinedParameters() {
        // Act - Test multiple parameters together
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port
                        + "/manage/v2/logs?filename=ErrorLog.txt&format=json&start=2020-01-01T00:00:00&end=2025-12-31T23:59:59&regex=.*",
                String.class);

        // Assert
        // Should either succeed or return Bad Request depending on log type and
        // MarkLogic configuration
        assertTrue(response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.BAD_REQUEST,
                "Combined parameters should return OK or Bad Request. Got: " + response.getStatusCode());

        assertNotNull(response.getBody());
    }
}
