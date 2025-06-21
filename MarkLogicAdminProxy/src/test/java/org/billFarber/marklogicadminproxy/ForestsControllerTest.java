package org.billFarber.marklogicadminproxy;

import com.marklogic.client.DatabaseClient;
import okhttp3.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ForestsControllerTest {

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
    private ForestsController forestsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Set up the configuration values
        ReflectionTestUtils.setField(forestsController, "marklogicHost", "localhost");
        ReflectionTestUtils.setField(forestsController, "marklogicSchema", "http");

        // Set up the mock chain
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
    }

    @Test
    void testGetForestsSuccess() throws IOException {
        // Arrange
        String expectedResponse = "{\"forest-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"Documents\"},{\"nameref\":\"Security\"}]}}}";

        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(response.header("Content-Type", "application/json")).thenReturn("application/json");
        when(responseBody.string()).thenReturn(expectedResponse);

        // Act
        ResponseEntity<String> result = forestsController.getForests("json", null, null, null, null, null);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());
        assertEquals("application/json", result.getHeaders().getFirst("Content-Type"));

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
        verify(response).isSuccessful();
    }

    @Test
    void testGetForestsWithViewParameter() throws IOException {
        // Arrange
        String expectedResponse = "{\"forest-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"Documents\"},{\"nameref\":\"Security\"}]}}}";

        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(response.header("Content-Type", "application/json")).thenReturn("application/json");
        when(responseBody.string()).thenReturn(expectedResponse);

        // Act
        ResponseEntity<String> result = forestsController.getForests("json", "default", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
    }

    @Test
    void testGetForestsMarkLogicError() throws IOException {
        // Arrange
        String errorResponse = "{\"errorResponse\":{\"message\":\"Forest not found\"}}";

        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(404);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(errorResponse);

        // Act
        ResponseEntity<String> result = forestsController.getForests(null, null, null, null, null, null);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertEquals(errorResponse, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetForestsIOException() throws IOException {
        // Arrange
        when(call.execute()).thenThrow(new IOException("Connection failed"));

        // Act
        ResponseEntity<String> result = forestsController.getForests(null, null, null, null, null, null);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertTrue(result.getBody().contains("Error communicating with MarkLogic"));
        assertTrue(result.getBody().contains("Connection failed"));

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetForestsNullResponseBody() throws IOException {
        // Arrange
        when(call.execute()).thenReturn(response);
        when(response.body()).thenReturn(null);

        // Act
        ResponseEntity<String> result = forestsController.getForests(null, null, null, null, null, null);

        // Assert assertEquals(HttpStatus.INTERNAL_SERVER_ERROR,
        // result.getStatusCode());
        assertEquals("No response from MarkLogic server", result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetForestsEmptyParameters() throws IOException {
        // Arrange
        String expectedResponse = "{\"forest-default-list\":{\"list-items\":{\"list-item\":[]}}}";
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(response.header("Content-Type", "application/json")).thenReturn("application/json");
        when(responseBody.string()).thenReturn(expectedResponse);

        // Act
        ResponseEntity<String> result = forestsController.getForests(null, null, null, null, null, null);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
    }

    @Test
    void testGetForestsInvalidFormatParameter() {
        // Act
        ResponseEntity<String> result = forestsController.getForests("invalid", null, null, null, null, null);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetForestsInvalidViewParameter() {
        // Act
        ResponseEntity<String> result = forestsController.getForests("json", "invalid", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid view parameter"));
    }

    @Test
    void testGetForestsInvalidFullrefsParameter() {
        // Act
        ResponseEntity<String> result = forestsController.getForests("json", null, null, null, null, "invalid");

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid fullrefs parameter"));
    }

    @Test
    void testGetForestPropertiesSuccess() throws IOException {
        // Arrange
        String expectedResponse = "{\"forest-properties\":{\"forest-name\":\"Documents\",\"enabled\":true,\"rebalancer-enable\":true}}";

        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(response.header("Content-Type", "application/json")).thenReturn("application/json");
        when(responseBody.string()).thenReturn(expectedResponse);

        // Act
        ResponseEntity<String> result = forestsController.getForestProperties("Documents", "json");

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());
        assertEquals("application/json", result.getHeaders().getFirst("Content-Type"));

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
        verify(response).isSuccessful();
    }

    @Test
    void testGetForestPropertiesWithXmlFormat() throws IOException {
        // Arrange
        String expectedResponse = "<forest-properties><forest-name>Documents</forest-name><enabled>true</enabled></forest-properties>";

        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(response.header("Content-Type", "application/json")).thenReturn("application/xml");
        when(responseBody.string()).thenReturn(expectedResponse);

        // Act
        ResponseEntity<String> result = forestsController.getForestProperties("Documents", "xml");

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());
        assertEquals("application/xml", result.getHeaders().getFirst("Content-Type"));

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
        verify(response).isSuccessful();
    }

    @Test
    void testGetForestPropertiesWithEmptyFormat() {
        // Act - Test with empty string format (should be invalid)
        ResponseEntity<String> result = forestsController.getForestProperties("Security", "");

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetForestPropertiesWithNullFormat() throws IOException {
        // Arrange
        String expectedResponse = "{\"forest-properties\":{\"forest-name\":\"Security\",\"enabled\":true}}";

        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(response.header("Content-Type", "application/json")).thenReturn("application/json");
        when(responseBody.string()).thenReturn(expectedResponse);

        // Act - Test null format (should default to json)
        ResponseEntity<String> result = forestsController.getForestProperties("Security", null);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
    }

    @Test
    void testGetForestPropertiesInvalidFormat() {
        // Act
        ResponseEntity<String> result = forestsController.getForestProperties("Documents", "invalid");

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid format parameter. Must be 'json' or 'xml'"));
    }

    @Test
    void testGetForestPropertiesMarkLogicError() throws IOException {
        // Arrange
        String errorResponse = "{\"errorResponse\":{\"message\":\"Forest not found\"}}";

        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(404);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(errorResponse);

        // Act
        ResponseEntity<String> result = forestsController.getForestProperties("NonExistent", "json");

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertEquals(errorResponse, result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetForestPropertiesIOException() throws IOException {
        // Arrange
        when(call.execute()).thenThrow(new IOException("Connection failed"));

        // Act
        ResponseEntity<String> result = forestsController.getForestProperties("Documents", "json");

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertTrue(result.getBody().contains("Error communicating with MarkLogic"));
        assertTrue(result.getBody().contains("Connection failed"));

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetForestPropertiesNullResponseBody() throws IOException {
        // Arrange
        when(call.execute()).thenReturn(response);
        when(response.body()).thenReturn(null);

        // Act
        ResponseEntity<String> result = forestsController.getForestProperties("Documents", "json");

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertEquals("No response from MarkLogic server", result.getBody());

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetForestPropertiesUnexpectedException() throws IOException {
        // Arrange
        when(call.execute()).thenThrow(new RuntimeException("Unexpected error"));

        // Act
        ResponseEntity<String> result = forestsController.getForestProperties("Documents", "json");

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertTrue(result.getBody().contains("Unexpected error"));
        assertTrue(result.getBody().contains("Unexpected error"));

        verify(databaseClient).getClientImplementation();
        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }
}
