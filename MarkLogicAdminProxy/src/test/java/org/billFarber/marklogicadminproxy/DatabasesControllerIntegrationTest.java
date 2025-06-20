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
class DatabasesControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testGetDatabasesIntegration() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/databases?format=json",
                String.class); // Assert
        // This test requires MarkLogic to be running, accessible, and responding
        // successfully
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected database data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("database-default-list") ||
                response.getBody().contains("list-items"),
                "Response should contain database list data");
    }

    @Test
    void testGetDatabasesWithViewParameter() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/databases?format=json&view=metrics",
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
}
