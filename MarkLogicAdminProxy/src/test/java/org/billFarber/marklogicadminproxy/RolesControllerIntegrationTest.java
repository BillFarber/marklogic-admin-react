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
class RolesControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testGetRolesIntegration() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles?format=json",
                String.class);

        // Assert
        // This test requires MarkLogic to be running, accessible, and responding
        // successfully
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected role data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("role-default-list") ||
                response.getBody().contains("list-items"),
                "Response should contain role list data");
    }

    @Test
    void testGetRolesWithXmlFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles?format=xml",
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
    void testGetRolesWithHtmlFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles?format=html",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected HTML data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("<html") || response.getBody().contains("<HTML"),
                "Response should contain HTML data");
    }

    @Test
    void testGetRolesDefaultFormat() {
        // Act - Test default format (should be XML)
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected XML data (default format)
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("<") && response.getBody().contains(">"),
                "Response should contain XML data by default");
    }

    @Test
    void testGetRolesInvalidFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles?format=invalid",
                String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("Invalid format parameter"),
                "Response should contain error message about invalid format");
    }

    @Test
    void testGetRolePropertiesIntegration() {
        // Act - Test with a standard role that should exist in MarkLogic (admin)
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles/admin/properties?format=json",
                String.class);

        // Assert
        // This test requires MarkLogic to be running, accessible, and responding
        // successfully
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected role properties data
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("role-name") ||
                response.getBody().contains("admin"),
                "Response should contain role properties data");
    }

    @Test
    void testGetRolePropertiesWithXmlFormat() {
        // Act - Test XML format
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles/admin/properties?format=xml",
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
    void testGetRolePropertiesDefaultFormat() {
        // Act - Test default format (should be XML)
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles/admin/properties",
                String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Expected successful response from MarkLogic. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());

        // Verify response contains expected XML data (default format)
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("<") && response.getBody().contains(">"),
                "Response should contain XML data by default");
    }

    @Test
    void testGetRolePropertiesInvalidFormat() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles/admin/properties?format=html",
                String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("Invalid format parameter"),
                "Response should contain error message about invalid format");
    }

    @Test
    void testGetRolePropertiesNonExistentRole() {
        // Act - Test with a role that likely doesn't exist
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles/nonexistent-role-12345/properties?format=json",
                String.class);

        // Assert
        // Should return 404 for non-existent role
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode(),
                "Expected 404 for non-existent role. Got: " + response.getStatusCode() +
                        " with body: " + response.getBody());
    }

    @Test
    void testGetRolePropertiesWithSpecialCharacters() {
        // Act - Test with role name that has special characters (if such role exists)
        // Note: This test assumes 'manage-user' role exists which is a standard
        // MarkLogic role
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/manage/v2/roles/manage-user/properties?format=json",
                String.class);

        // Assert
        // This should work if the manage-user role exists
        assertTrue(response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.NOT_FOUND,
                "Expected either OK or NOT_FOUND for manage-user role. Got: " + response.getStatusCode());

        if (response.getStatusCode() == HttpStatus.OK) {
            assertNotNull(response.getBody());
            assertTrue(response.getBody().contains("role-name") ||
                    response.getBody().contains("manage-user"),
                    "Response should contain role properties data for manage-user");
        }
    }
}
