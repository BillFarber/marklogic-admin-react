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
class ForestsControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testGetForestsEndpoint() {
        // This test requires MarkLogic to be running and accessible
        String url = "http://localhost:" + port + "/manage/v2/forests?format=json";

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Should get a successful response when MarkLogic is available
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        // Response should contain JSON with forest information
        String body = response.getBody();
        assertTrue(body.contains("forest") || body.contains("list"),
                "Response should contain forest or list information");
    }

    @Test
    void testGetForestsWithViewParameter() {
        // Test with view parameter
        String url = "http://localhost:" + port + "/manage/v2/forests?format=json&view=default";

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        String body = response.getBody();
        assertTrue(body.contains("forest") || body.contains("list"),
                "Response should contain forest information");
    }

    @Test
    void testGetForestPropertiesEndpoint() {
        // This test requires MarkLogic to be running and accessible
        // Using "Documents" as it's a standard forest that should exist
        String url = "http://localhost:" + port + "/manage/v2/forests/Documents/properties?format=json";

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Should get a successful response when MarkLogic is available
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        // Response should contain JSON with forest properties
        String body = response.getBody();
        assertTrue(body.contains("forest") || body.contains("properties"),
                "Response should contain forest properties information");
    }

    @Test
    void testGetForestPropertiesWithXmlFormat() {
        // Test with XML format
        String url = "http://localhost:" + port + "/manage/v2/forests/Documents/properties?format=xml";

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        String body = response.getBody();
        assertTrue(body.contains("<") && body.contains(">"),
                "Response should contain XML format");
    }

    @Test
    void testGetForestPropertiesInvalidFormat() {
        // Test with invalid format parameter
        String url = "http://localhost:" + port + "/manage/v2/forests/Documents/properties?format=invalid";

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("Invalid format parameter"),
                "Response should contain error message about invalid format");
    }
}
