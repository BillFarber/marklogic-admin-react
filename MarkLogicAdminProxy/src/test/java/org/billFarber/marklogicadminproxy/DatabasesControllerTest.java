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

class DatabasesControllerTest {

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
    private DatabasesController databasesController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(databasesController, "marklogicHost", "localhost");
        ReflectionTestUtils.setField(databasesController, "marklogicSchema", "http");
    }

    @Test
    void testGetDatabases_Success() throws Exception {
        // Arrange
        String mockJson = "{\"database-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"Documents\"},{\"nameref\":\"Modules\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = databasesController.getDatabases("json", null);

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetDatabases_WithViewParameter() throws Exception {
        // Arrange
        String mockJson = "{\"database-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"Documents\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = databasesController.getDatabases("json", "summary");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(mockJson, result.getBody());
    }

    @Test
    void testGetDatabases_MarkLogicError() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(401);

        // Act
        ResponseEntity<String> result = databasesController.getDatabases("json", null);

        // Assert
        assertEquals(401, result.getStatusCode().value());
        assertTrue(result.getBody().contains("MarkLogic returned status: 401"));
    }

    @Test
    void testGetDatabases_Exception() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Network error"));

        // Act
        ResponseEntity<String> result = databasesController.getDatabases("json", null);

        // Assert
        assertEquals(502, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic: Network error"));
    }

    @Test
    void testGetDatabaseProperties_Success() throws Exception {
        // Arrange
        String mockJson = "{\"database-properties\":{\"database-name\":\"Documents\",\"enabled\":true}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockJson);

        // Act
        ResponseEntity<String> result = databasesController.getDatabaseProperties("Documents", "json");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockJson, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetDatabaseProperties_XmlFormat() throws Exception {
        // Arrange
        String mockXml = "<database-properties><database-name>Documents</database-name></database-properties>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockXml);

        // Act
        ResponseEntity<String> result = databasesController.getDatabaseProperties("Documents", "xml");

        // Assert
        assertEquals(200, result.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockXml, result.getBody());
    }

    @Test
    void testGetDatabaseProperties_InvalidFormat() {
        // Act
        ResponseEntity<String> result = databasesController.getDatabaseProperties("Documents", "invalid");

        // Assert
        assertEquals(400, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Invalid format parameter. Must be 'json' or 'xml'"));
    }

    @Test
    void testGetDatabaseProperties_MarkLogicError() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(404);

        // Act
        ResponseEntity<String> result = databasesController.getDatabaseProperties("NonExistent", "json");

        // Assert
        assertEquals(404, result.getStatusCode().value());
        assertTrue(result.getBody().contains("MarkLogic returned status: 404"));
    }

    @Test
    void testGetDatabaseProperties_Exception() throws Exception {
        // Arrange
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Network error"));

        // Act
        ResponseEntity<String> result = databasesController.getDatabaseProperties("Documents", "json");

        // Assert
        assertEquals(502, result.getStatusCode().value());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic: Network error"));
    }
}
