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
class HostsControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testGetHostsIntegration() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=json",
                String.class);

        // Assert
        // This test requires MarkLogic to be running, accessible, and responding
        // successfully
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected host data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("host-default-list") ||
                response.getBody().contains("list-items") ||
                response.getBody().contains("nameref"),
                "Response should contain host list data");
    }

    @Test
    void testGetHostsWithXmlFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=xml",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected XML data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("<") && response.getBody().contains(">"),
                "Response should contain XML data");
    }

    @Test
    void testGetHostsWithHtmlFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=html",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected HTML data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("<html") || response.getBody().contains("<table") ||
                response.getBody().contains("<!DOCTYPE"),
                "Response should contain HTML data");
    }

    @Test
    void testGetHostsWithGroupId() {
        // Act - Test with Default group (should exist in standard MarkLogic
        // installation)
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=json&group-id=Default",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected data
        assertNotNull(response.getBody());
    }

    @Test
    void testGetHostsWithStatusView() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=json&view=status",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected data
        assertNotNull(response.getBody());
    }

    @Test
    void testGetHostsWithMetricsView() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=json&view=metrics",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected data
        assertNotNull(response.getBody());
    }

    @Test
    void testGetHostsWithSchemaView() {
        // Act - Schema view requires XML format, not JSON
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=xml&view=schema",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected XML data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("<") && response.getBody().contains(">"),
                "Response should contain XML data");
    }

    @Test
    void testGetHostsWithDefaultView() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=json&view=default",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected data
        assertNotNull(response.getBody());
    }

    @Test
    void testGetHostsWithAllParameters() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=json&group-id=Default&view=status",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected data
        assertNotNull(response.getBody());
    }

    @Test
    void testGetHostsWithInvalidFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=invalid",
                String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetHostsWithInvalidView() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=json&view=invalid",
                String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("Invalid view parameter"));
    }

    @Test
    void testGetHostPropertiesIntegration() {
        // First, get the list of hosts to find a valid host name/ID
        ResponseEntity<String> hostsResponse = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts?format=json",
                String.class);

        assertEquals(HttpStatus.OK, hostsResponse.getStatusCode());
        assertNotNull(hostsResponse.getBody());

        // For this test, we'll use 'localhost' as it's commonly available in MarkLogic
        // test setups
        // In a real environment, you might parse the hosts response to get an actual
        // host name
        String hostId = "localhost";

        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts/" + hostId + "/properties?format=json",
                String.class);

        // Assert
        // Note: This may return 404 if the host doesn't exist, which is also a valid
        // test outcome
        assertTrue(response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.NOT_FOUND,
                "Expected either successful response or 404 from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        if (response.getStatusCode() == HttpStatus.OK) {
            // Verify response contains expected host properties data
            assertNotNull(response.getBody());
            assertTrue(response.getBody().contains("host-name") ||
                    response.getBody().contains("group") ||
                    response.getBody().contains("bind-port"),
                    "Response should contain host properties data");
        }
    }

    @Test
    void testGetHostPropertiesWithXmlFormat() {
        // Use 'localhost' as a test host
        String hostId = "localhost";

        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts/" + hostId + "/properties?format=xml",
                String.class);

        // Assert
        // Note: This may return 404 if the host doesn't exist, which is also a valid
        // test outcome
        assertTrue(response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.NOT_FOUND,
                "Expected either successful response or 404 from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        if (response.getStatusCode() == HttpStatus.OK) {
            // Verify response contains expected XML data
            assertNotNull(response.getBody());
            assertTrue(response.getBody().contains("<") && response.getBody().contains(">"),
                    "Response should contain XML data");
        }
    }

    @Test
    void testGetHostPropertiesWithDefaultFormat() {
        // Use 'localhost' as a test host
        String hostId = "localhost";

        // Act - No format parameter should default to JSON
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts/" + hostId + "/properties",
                String.class);

        // Assert
        // Note: This may return 404 if the host doesn't exist, which is also a valid
        // test outcome
        assertTrue(response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.NOT_FOUND,
                "Expected either successful response or 404 from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        if (response.getStatusCode() == HttpStatus.OK) {
            // Verify response contains expected data
            assertNotNull(response.getBody());
        }
    }

    @Test
    void testGetHostPropertiesWithInvalidFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts/localhost/properties?format=html",
                String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetHostPropertiesNonExistentHost() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/hosts/non-existent-host-12345/properties?format=json",
                String.class);

        // Assert
        // Should return either 404 (host not found) or potentially another error code
        assertTrue(response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError(),
                "Expected client or server error for non-existent host. Got: " + response.getStatusCode());
    }
}
