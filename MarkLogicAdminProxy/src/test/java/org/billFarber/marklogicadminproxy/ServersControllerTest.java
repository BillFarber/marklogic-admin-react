package org.billFarber.marklogicadminproxy;

import com.marklogic.client.DatabaseClient;
import okhttp3.Call;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ServersControllerTest {

    @Mock
    private DatabaseClient databaseClient;

    @Mock
    private OkHttpClient okHttpClient;

    @Mock
    private Call call;

    @Mock
    private Response response;

    @Mock
    private ResponseBody responseBody;

    @InjectMocks
    private ServersController serversController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(serversController, "marklogicHost", "localhost");
        ReflectionTestUtils.setField(serversController, "marklogicSchema", "http");
    }

    @Test
    void testGetServers_Success() throws Exception {
        // Arrange
        String mockJson = "{\"server-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"Admin\",\"kindref\":\"http\"},{\"nameref\":\"App-Services\",\"kindref\":\"http\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = serversController.getServers("json", null, null, null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetServers_WithAllParameters() throws Exception {
        // Arrange
        String mockJson = "{\"server-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"Admin\",\"kindref\":\"http\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = serversController.getServers("json", "Default", "status", "true");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());
    }

    @Test
    void testGetServers_XmlFormat() throws Exception {
        // Arrange
        String mockXml = "<server-default-list><list-items><list-item><nameref>Admin</nameref></list-item></list-items></server-default-list>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockXml);

        // Act
        ResponseEntity<String> result = serversController.getServers("xml", null, null, null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockXml, result.getBody());
    }

    @Test
    void testGetServers_HtmlFormat() throws Exception {
        // Arrange
        String mockHtml = "<html><body><h1>Servers</h1></body></html>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockHtml);

        // Act
        ResponseEntity<String> result = serversController.getServers("html", null, null, null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.TEXT_HTML, result.getHeaders().getContentType());
        assertEquals(mockHtml, result.getBody());
    }

    @Test
    void testGetServers_InvalidFormat() {
        // Act
        ResponseEntity<String> result = serversController.getServers("invalid", null, null, null);

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetServers_InvalidView() {
        // Act
        ResponseEntity<String> result = serversController.getServers("json", null, "invalid", null);

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Invalid view parameter"));
    }

    @Test
    void testGetServers_InvalidFullrefs() {
        // Act
        ResponseEntity<String> result = serversController.getServers("json", null, null, "invalid");

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Invalid fullrefs parameter"));
    }

    @Test
    void testGetServers_ValidViewParameters() throws Exception {
        // Test all valid view parameters
        String[] validViews = { "default", "schema", "status", "metrics", "package" };
        String mockJson = "{\"server-default-list\":{\"list-items\":{\"list-item\":[]}}}";

        for (String view : validViews) {
            when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
            when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
            when(call.execute()).thenReturn(response);
            when(response.isSuccessful()).thenReturn(true);
            when(response.body()).thenReturn(responseBody);
            when(responseBody.string()).thenReturn(mockJson);

            // Act
            ResponseEntity<String> result = serversController.getServers("json", null, view, null);

            // Assert
            assertEquals(200, result.getStatusCode().value());
            assertEquals(mockJson, result.getBody());
        }
    }

    @Test
    void testGetServers_ValidFullrefsParameters() throws Exception {
        // Test valid fullrefs parameters
        String[] validFullrefs = { "true", "false" };
        String mockJson = "{\"server-default-list\":{\"list-items\":{\"list-item\":[]}}}";

        for (String fullref : validFullrefs) {
            when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
            when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
            when(call.execute()).thenReturn(response);
            when(response.isSuccessful()).thenReturn(true);
            when(response.body()).thenReturn(responseBody);
            when(responseBody.string()).thenReturn(mockJson);

            // Act
            ResponseEntity<String> result = serversController.getServers("json", null, null, fullref);

            // Assert
            assertEquals(200, result.getStatusCode().value());
            assertEquals(mockJson, result.getBody());
        }
    }

    @Test
    void testGetServers_MarkLogicError() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(500);

        // Act
        ResponseEntity<String> result = serversController.getServers("json", null, null, null);

        // Assert
        assertEquals(500, result.getStatusCode().value());
        assertTrue(result.getBody().contains("MarkLogic returned status: 500"));
    }

    @Test
    void testGetServers_Exception() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Connection failed"));

        // Act
        ResponseEntity<String> result = serversController.getServers("json", null, null, null);

        // Assert
        assertEquals(502, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic"));
        assertTrue(result.getBody().contains("Connection failed"));
    }

    @Test
    void testGetServers_EmptyParameters() throws Exception {
        // Arrange - test that empty strings are handled properly
        String mockJson = "{\"server-default-list\":{\"list-items\":{\"list-item\":[]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = serversController.getServers("json", "", "", "");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(mockJson, result.getBody());
    }
}
