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

class HostsControllerTest {

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
    private HostsController hostsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(hostsController, "marklogicHost", "localhost");
        ReflectionTestUtils.setField(hostsController, "marklogicSchema", "http");
    }

    // Tests for getHosts endpoint

    @Test
    void testGetHosts_Success_DefaultParameters() throws Exception {
        // Arrange
        String mockJson = "{\"host-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"host1\"},{\"nameref\":\"host2\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = hostsController.getHosts(null, null, null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetHosts_Success_WithJsonFormat() throws Exception {
        // Arrange
        String mockJson = "{\"host-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"host1\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = hostsController.getHosts("json", null, null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());
    }

    @Test
    void testGetHosts_Success_WithXmlFormat() throws Exception {
        // Arrange
        String mockXml = "<host-default-list><list-items><list-item><nameref>host1</nameref></list-item></list-items></host-default-list>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockXml);

        // Act
        ResponseEntity<String> result = hostsController.getHosts("xml", null, null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockXml, result.getBody());
    }

    @Test
    void testGetHosts_Success_WithHtmlFormat() throws Exception {
        // Arrange
        String mockHtml = "<html><body><h1>Hosts List</h1></body></html>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockHtml);

        // Act
        ResponseEntity<String> result = hostsController.getHosts("html", null, null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.TEXT_HTML, result.getHeaders().getContentType());
        assertEquals(mockHtml, result.getBody());
    }

    @Test
    void testGetHosts_Success_WithGroupId() throws Exception {
        // Arrange
        String mockJson = "{\"host-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"host1\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = hostsController.getHosts("json", "Default", null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(mockJson, result.getBody());
    }

    @Test
    void testGetHosts_Success_WithView() throws Exception {
        // Arrange
        String mockJson = "{\"host-status-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"host1\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = hostsController.getHosts("json", null, "status");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(mockJson, result.getBody());
    }

    @Test
    void testGetHosts_Success_WithAllParameters() throws Exception {
        // Arrange
        String mockJson = "{\"host-metrics-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"host1\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = hostsController.getHosts("json", "Default", "metrics");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(mockJson, result.getBody());
    }

    @Test
    void testGetHosts_InvalidFormat() {
        // Act
        ResponseEntity<String> result = hostsController.getHosts("invalid", null, null);

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Invalid format parameter. Must be 'html', 'json', or 'xml'"));
    }

    @Test
    void testGetHosts_InvalidView() {
        // Act
        ResponseEntity<String> result = hostsController.getHosts("json", null, "invalid");

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(
                result.getBody().contains("Invalid view parameter. Must be one of: schema, status, metrics, default"));
    }

    @Test
    void testGetHosts_ValidViewParameters() throws Exception {
        // Arrange
        String mockJson = "{\"host-list\":{}}";
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Test all valid view values
        String[] validViews = { "schema", "status", "metrics", "default" };

        for (String view : validViews) {
            // Act
            ResponseEntity<String> result = hostsController.getHosts("json", null, view);

            // Assert
            assertEquals(200, result.getStatusCode().value());
            assertEquals(mockJson, result.getBody());
        }
    }

    @Test
    void testGetHosts_MarkLogicError() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(401);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn("Unauthorized");

        // Act
        ResponseEntity<String> result = hostsController.getHosts("json", null, null);

        // Assert
        assertEquals(401, result.getStatusCode().value());
        assertTrue(result.getBody().contains("MarkLogic returned status: 401"));
    }

    @Test
    void testGetHosts_IOException() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new java.io.IOException("Network error"));

        // Act
        ResponseEntity<String> result = hostsController.getHosts("json", null, null);

        // Assert
        assertEquals(502, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic: Network error"));
    }

    @Test
    void testGetHosts_GeneralException() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Unexpected error"));

        // Act
        ResponseEntity<String> result = hostsController.getHosts("json", null, null);

        // Assert
        assertEquals(500, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Unexpected error: Unexpected error"));
    }

    @Test
    void testGetHosts_NullResponseBody() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.body()).thenReturn(null);

        // Act
        ResponseEntity<String> result = hostsController.getHosts("json", null, null);

        // Assert
        assertEquals(500, result.getStatusCode().value());
        assertTrue(result.getBody().contains("No response from MarkLogic server"));
    }

    // Tests for getHostProperties endpoint

    @Test
    void testGetHostProperties_Success_JsonFormat() throws Exception {
        // Arrange
        String mockJson = "{\"host-name\":\"host1\",\"group\":\"Default\",\"bind-port\":7999}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = hostsController.getHostProperties("host1", "json");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetHostProperties_Success_XmlFormat() throws Exception {
        // Arrange
        String mockXml = "<host-properties><host-name>host1</host-name><group>Default</group></host-properties>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockXml);

        // Act
        ResponseEntity<String> result = hostsController.getHostProperties("host1", "xml");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockXml, result.getBody());
    }

    @Test
    void testGetHostProperties_Success_DefaultFormat() throws Exception {
        // Arrange
        String mockJson = "{\"host-name\":\"host1\",\"group\":\"Default\"}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = hostsController.getHostProperties("host1", null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());
    }

    @Test
    void testGetHostProperties_InvalidFormat() {
        // Act
        ResponseEntity<String> result = hostsController.getHostProperties("host1", "html");

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Invalid format parameter. Must be 'json' or 'xml'"));
    }

    @Test
    void testGetHostProperties_MarkLogicError() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(404);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn("Host not found");

        // Act
        ResponseEntity<String> result = hostsController.getHostProperties("nonexistent", "json");

        // Assert
        assertEquals(404, result.getStatusCode().value());
        assertTrue(result.getBody().contains("MarkLogic returned status: 404"));
    }

    @Test
    void testGetHostProperties_IOException() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new java.io.IOException("Connection timeout"));

        // Act
        ResponseEntity<String> result = hostsController.getHostProperties("host1", "json");

        // Assert
        assertEquals(502, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic: Connection timeout"));
    }

    @Test
    void testGetHostProperties_GeneralException() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Unexpected error"));

        // Act
        ResponseEntity<String> result = hostsController.getHostProperties("host1", "json");

        // Assert
        assertEquals(500, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Unexpected error: Unexpected error"));
    }

    @Test
    void testGetHostProperties_NullResponseBody() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.body()).thenReturn(null);

        // Act
        ResponseEntity<String> result = hostsController.getHostProperties("host1", "json");

        // Assert
        assertEquals(500, result.getStatusCode().value());
        assertTrue(result.getBody().contains("No response from MarkLogic server"));
    }
}
