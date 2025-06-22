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

class GroupsControllerTest {

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
    private GroupsController groupsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(groupsController, "marklogicHost", "localhost");
        ReflectionTestUtils.setField(groupsController, "marklogicSchema", "http");
    }

    @Test
    void testGetGroups_Success() throws Exception {
        // Arrange
        String mockJson = "{\"group-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"Default\"},{\"nameref\":\"Evaluator\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = groupsController.getGroups("json", null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetGroups_WithViewParameter() throws Exception {
        // Arrange
        String mockJson = "{\"group-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"Default\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = groupsController.getGroups("json", "schema");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(mockJson, result.getBody());
    }

    @Test
    void testGetGroups_XmlFormat() throws Exception {
        // Arrange
        String mockXml = "<group-default-list><list-items><list-item><nameref>Default</nameref></list-item></list-items></group-default-list>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockXml);

        // Act
        ResponseEntity<String> result = groupsController.getGroups("xml", null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockXml, result.getBody());
    }

    @Test
    void testGetGroups_HtmlFormat() throws Exception {
        // Arrange
        String mockHtml = "<html><body><h1>Groups</h1></body></html>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockHtml);

        // Act
        ResponseEntity<String> result = groupsController.getGroups("html", null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.TEXT_HTML, result.getHeaders().getContentType());
        assertEquals(mockHtml, result.getBody());
    }

    @Test
    void testGetGroups_InvalidFormat() {
        // Act
        ResponseEntity<String> result = groupsController.getGroups("invalid", null);

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetGroups_InvalidView() {
        // Act
        ResponseEntity<String> result = groupsController.getGroups("json", "invalid");

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Invalid view parameter"));
    }

    @Test
    void testGetGroups_MarkLogicError() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(404);

        // Act
        ResponseEntity<String> result = groupsController.getGroups("json", null);

        // Assert
        assertEquals(404, result.getStatusCode().value());
        assertTrue(result.getBody().contains("MarkLogic returned status: 404"));
    }

    @Test
    void testGetGroups_NetworkException() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Network error"));

        // Act
        ResponseEntity<String> result = groupsController.getGroups("json", null);

        // Assert
        assertEquals(502, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic"));
        assertTrue(result.getBody().contains("Network error"));
    }

    @Test
    void testGetGroupProperties_Success() throws Exception {
        // Arrange
        String mockJson = "{\"group-properties\":{\"group-name\":\"Default\",\"cache-sizing\":\"automatic\"}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = groupsController.getGroupProperties("Default", "json");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetGroupProperties_XmlFormat() throws Exception {
        // Arrange
        String mockXml = "<group-properties><group-name>Default</group-name><cache-sizing>automatic</cache-sizing></group-properties>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockXml);

        // Act
        ResponseEntity<String> result = groupsController.getGroupProperties("Default", "xml");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockXml, result.getBody());
    }

    @Test
    void testGetGroupProperties_InvalidFormat() {
        // Act
        ResponseEntity<String> result = groupsController.getGroupProperties("Default", "invalid");

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetGroupProperties_MarkLogicError() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(404);

        // Act
        ResponseEntity<String> result = groupsController.getGroupProperties("NonExistent", "json");

        // Assert
        assertEquals(404, result.getStatusCode().value());
        assertTrue(result.getBody().contains("MarkLogic returned status: 404"));
    }

    @Test
    void testGetGroupProperties_NetworkException() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Network error"));

        // Act
        ResponseEntity<String> result = groupsController.getGroupProperties("Default", "json");

        // Assert
        assertEquals(502, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic"));
        assertTrue(result.getBody().contains("Network error"));
    }

    @Test
    void testGetGroupProperties_DefaultFormat() throws Exception {
        // Arrange
        String mockJson = "{\"group-properties\":{\"group-name\":\"Default\"}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act - No format parameter, should default to json
        ResponseEntity<String> result = groupsController.getGroupProperties("Default", null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());
    }
}
