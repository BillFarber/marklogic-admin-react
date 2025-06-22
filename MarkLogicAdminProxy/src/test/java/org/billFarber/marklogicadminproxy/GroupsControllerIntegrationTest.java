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
class GroupsControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testGetGroupsIntegration() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups?format=json",
                String.class);

        // Assert
        // This test requires MarkLogic to be running, accessible, and responding
        // successfully
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected group data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("group-default-list") ||
                response.getBody().contains("list-items"),
                "Response should contain group list data");
    }

    @Test
    void testGetGroupsWithViewParameter() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups?format=json&view=default",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void testGetGroupsWithXmlFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups?format=xml",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        // XML response should contain XML structure
        assertTrue(response.getBody().contains("<") && response.getBody().contains(">"));
    }

    @Test
    void testGetGroupsWithHtmlFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups?format=html",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        // HTML response should contain HTML structure
        assertTrue(response.getBody().contains("<html") || response.getBody().contains("<HTML"));
    }

    @Test
    void testGetGroupsInvalidFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups?format=invalid",
                String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetGroupsInvalidView() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups?format=json&view=invalid",
                String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("Invalid view parameter"));
    }

    @Test
    void testGetGroupPropertiesIntegration() {
        // First, get the list of groups to find a valid group name
        ResponseEntity<String> groupsResponse = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups?format=json",
                String.class);

        assertEquals(HttpStatus.OK, groupsResponse.getStatusCode());
        assertNotNull(groupsResponse.getBody());

        // Use "Default" as it's typically available in MarkLogic installations
        String groupName = "Default";

        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups/" + groupName + "/properties?format=json",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response for group properties. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected group properties data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("group-name") ||
                response.getBody().contains("cache-sizing") ||
                response.getBody().contains("properties"),
                "Response should contain group properties data");
    }

    @Test
    void testGetGroupPropertiesWithXmlFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups/Default/properties?format=xml",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        // XML response should contain XML structure
        assertTrue(response.getBody().contains("<") && response.getBody().contains(">"));
    }

    @Test
    void testGetGroupPropertiesInvalidFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups/Default/properties?format=invalid",
                String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetGroupPropertiesNonExistentGroup() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/groups/NonExistentGroup/properties?format=json",
                String.class);

        // Assert
        // This should return an error from MarkLogic (typically 404 or 400)
        assertTrue(response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError(),
                "Expected client or server error for non-existent group");
    }
}
