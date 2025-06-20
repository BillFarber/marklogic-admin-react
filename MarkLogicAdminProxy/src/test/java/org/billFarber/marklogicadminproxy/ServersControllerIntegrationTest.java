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
class ServersControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testGetServersIntegration() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/servers?format=json",
                String.class);

        // Assert
        // This test requires MarkLogic to be running, accessible, and responding
        // successfully
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected server data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("server-default-list") ||
                response.getBody().contains("list-items"),
                "Response should contain server list data");
    }

    @Test
    void testGetServersWithViewParameter() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/servers?format=json&view=metrics",
                String.class);

        // Assert
        // This test requires MarkLogic to be running, accessible, and responding
        // successfully
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected data
        assertNotNull(response.getBody());
    }

    @Test
    void testGetServersWithGroupIdParameter() {
        // Act - Test with Default group (should exist in standard MarkLogic
        // installation)
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/servers?format=json&group-id=Default",
                String.class);

        // Assert
        // This test requires MarkLogic to be running, accessible, and responding
        // successfully
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected server data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("server-default-list") ||
                response.getBody().contains("list-items"),
                "Response should contain server list data for Default group");
    }

    @Test
    void testGetServersWithXmlFormat() {
        // Act - Test XML format
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/servers?format=xml",
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
    void testGetServersWithHtmlFormat() {
        // Act - Test HTML format
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/servers?format=html",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected HTML data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("<html") || response.getBody().contains("<HTML") ||
                response.getBody().contains("<!DOCTYPE"),
                "Response should contain HTML data");
    }

    @Test
    void testGetServersWithFullrefsParameter() {
        // Act - Test with fullrefs=true
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/servers?format=json&fullrefs=true",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected data
        assertNotNull(response.getBody());
    }

    @Test
    void testGetServersWithMultipleParameters() {
        // Act - Test with multiple parameters
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port
                        + "/manage/v2/servers?format=json&group-id=Default&view=default&fullrefs=false",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("server-default-list") ||
                response.getBody().contains("list-items"),
                "Response should contain server list data");
    }

    @Test
    void testGetServersWithPackageView() {
        // Act - Test package view which is specific to servers endpoint
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/servers?format=json&view=package",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected data
        assertNotNull(response.getBody());
    }
}
