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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LogsControllerTest {

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
    private LogsController logsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(logsController, "marklogicHost", "localhost");
        ReflectionTestUtils.setField(logsController, "marklogicSchema", "http");

        // Mock DatabaseClient to return OkHttpClient
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
    }

    @Test
    void testGetLogs_Success_WithRequiredFilename() throws Exception {
        // Arrange
        String mockResponseBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><log-data>Sample log content</log-data>";
        when(responseBody.string()).thenReturn(mockResponseBody);
        when(response.body()).thenReturn(responseBody);
        when(response.isSuccessful()).thenReturn(true);
        when(call.execute()).thenReturn(response);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);

        // Act
        ResponseEntity<String> result = logsController.getLogs(null, "ErrorLog.txt", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(mockResponseBody, result.getBody());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
    }

    @Test
    void testGetLogs_Success_WithJsonFormat() throws Exception {
        // Arrange
        String mockResponseBody = "{\"log-data\": \"Sample log content\"}";
        when(responseBody.string()).thenReturn(mockResponseBody);
        when(response.body()).thenReturn(responseBody);
        when(response.isSuccessful()).thenReturn(true);
        when(call.execute()).thenReturn(response);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);

        // Act
        ResponseEntity<String> result = logsController.getLogs("json", "ErrorLog.txt", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(mockResponseBody, result.getBody());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
    }

    @Test
    void testGetLogs_Success_WithAllParameters() throws Exception {
        // Arrange
        String mockResponseBody = "Sample filtered log content";
        when(responseBody.string()).thenReturn(mockResponseBody);
        when(response.body()).thenReturn(responseBody);
        when(response.isSuccessful()).thenReturn(true);
        when(call.execute()).thenReturn(response);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);

        // Act
        ResponseEntity<String> result = logsController.getLogs(
                "text",
                "ErrorLog.txt",
                "host1",
                "2023-01-01T00:00:00",
                "2023-01-02T00:00:00",
                "ERROR.*");

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(mockResponseBody, result.getBody());
        assertEquals(MediaType.TEXT_PLAIN, result.getHeaders().getContentType());
    }

    @Test
    void testGetLogs_InvalidFormat() {
        // Act
        ResponseEntity<String> result = logsController.getLogs("invalid", "ErrorLog.txt", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetLogs_MissingFilename() {
        // Act
        ResponseEntity<String> result = logsController.getLogs(null, null, null, null, null, null);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertTrue(result.getBody().contains("filename parameter is required"));
    }

    @Test
    void testGetLogs_EmptyFilename() {
        // Act
        ResponseEntity<String> result = logsController.getLogs(null, "  ", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertTrue(result.getBody().contains("filename parameter is required"));
    }

    @Test
    void testGetLogs_MarkLogicBadRequest() throws Exception {
        // Arrange
        String mockErrorBody = "Bad request: query parameters not supported for this log type";
        when(responseBody.string()).thenReturn(mockErrorBody);
        when(response.body()).thenReturn(responseBody);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(400);
        when(call.execute()).thenReturn(response);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);

        // Act
        ResponseEntity<String> result = logsController.getLogs("json", "AccessLog.txt", null, "2023-01-01", null, null);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertEquals(mockErrorBody, result.getBody());
    }

    @Test
    void testGetLogs_MarkLogicUnauthorized() throws Exception {
        // Arrange
        String mockErrorBody = "Unauthorized: insufficient privileges";
        when(responseBody.string()).thenReturn(mockErrorBody);
        when(response.body()).thenReturn(responseBody);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(401);
        when(call.execute()).thenReturn(response);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);

        // Act
        ResponseEntity<String> result = logsController.getLogs("json", "ErrorLog.txt", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        assertEquals(mockErrorBody, result.getBody());
    }

    @Test
    void testGetLogs_MarkLogicNotFound() throws Exception {
        // Arrange
        String mockErrorBody = "Log file not found";
        when(responseBody.string()).thenReturn(mockErrorBody);
        when(response.body()).thenReturn(responseBody);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(404);
        when(call.execute()).thenReturn(response);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);

        // Act
        ResponseEntity<String> result = logsController.getLogs("json", "NonExistentLog.txt", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertEquals(mockErrorBody, result.getBody());
    }

    @Test
    void testGetLogs_NetworkException() throws Exception {
        // Arrange
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Network error"));

        // Act
        ResponseEntity<String> result = logsController.getLogs("json", "ErrorLog.txt", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertTrue(result.getBody().contains("Failed to retrieve logs"));
        assertTrue(result.getBody().contains("Network error"));
    }

    @Test
    void testGetLogs_HtmlFormat() throws Exception {
        // Arrange
        String mockResponseBody = "<html><body>Log content</body></html>";
        when(responseBody.string()).thenReturn(mockResponseBody);
        when(response.body()).thenReturn(responseBody);
        when(response.isSuccessful()).thenReturn(true);
        when(call.execute()).thenReturn(response);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);

        // Act
        ResponseEntity<String> result = logsController.getLogs("html", "ErrorLog.txt", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(mockResponseBody, result.getBody());
        assertEquals(MediaType.TEXT_HTML, result.getHeaders().getContentType());
    }

    @Test
    void testGetLogs_ValidFormats() {
        // Test all valid format values
        String[] validFormats = { "json", "xml", "html", "text" };

        for (String format : validFormats) {
            try {
                // Arrange
                String mockResponseBody = "Sample content for " + format;
                when(responseBody.string()).thenReturn(mockResponseBody);
                when(response.body()).thenReturn(responseBody);
                when(response.isSuccessful()).thenReturn(true);
                when(call.execute()).thenReturn(response);
                when(okHttpClient.newCall(any(Request.class))).thenReturn(call);

                // Act
                ResponseEntity<String> result = logsController.getLogs(format, "ErrorLog.txt", null, null, null, null);

                // Assert
                assertEquals(HttpStatus.OK, result.getStatusCode(), "Format " + format + " should be valid");

                // Reset mocks for next iteration
                reset(call, response, responseBody);
            } catch (Exception e) {
                fail("Format " + format + " should be valid but threw exception: " + e.getMessage());
            }
        }
    }

    @Test
    void testGetLogs_MarkLogicServerError() throws Exception {
        // Arrange
        String mockErrorBody = "Internal server error";
        when(responseBody.string()).thenReturn(mockErrorBody);
        when(response.body()).thenReturn(responseBody);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(500);
        when(call.execute()).thenReturn(response);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);

        // Act
        ResponseEntity<String> result = logsController.getLogs("json", "ErrorLog.txt", null, null, null, null);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertEquals(mockErrorBody, result.getBody());
    }
}
