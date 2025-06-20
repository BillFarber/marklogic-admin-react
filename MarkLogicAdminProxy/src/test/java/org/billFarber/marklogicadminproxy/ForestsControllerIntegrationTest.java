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
}
