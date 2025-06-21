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

class UsersControllerTest {

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
    private UsersController usersController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(usersController, "marklogicHost", "localhost");
        ReflectionTestUtils.setField(usersController, "marklogicSchema", "http");
    }

    @Test
    void testGetUsers_Success() throws Exception {
        // Setup
        String mockResponseBody = "{\"user-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"admin\",\"idref\":\"123\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute
        ResponseEntity<String> result = usersController.getUsers("json");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());

        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetUsers_DefaultFormat() throws Exception {
        // Setup
        String mockResponseBody = "{\"user-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"admin\",\"idref\":\"123\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute - no format parameter should default to json
        ResponseEntity<String> result = usersController.getUsers(null);

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetUsers_XmlFormat() throws Exception {
        // Setup
        String mockResponseBody = "<user-default-list><list-items><list-item><nameref>admin</nameref><idref>123</idref></list-item></list-items></user-default-list>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute
        ResponseEntity<String> result = usersController.getUsers("xml");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetUsers_HtmlFormat() throws Exception {
        // Setup
        String mockResponseBody = "<html><body><h1>Users</h1></body></html>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute
        ResponseEntity<String> result = usersController.getUsers("html");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.TEXT_HTML, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetUsers_InvalidFormat() {
        // Execute
        ResponseEntity<String> result = usersController.getUsers("invalid");

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetUsers_MarkLogicError() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(500);

        // Execute
        ResponseEntity<String> result = usersController.getUsers("json");

        // Verify
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertTrue(result.getBody().contains("MarkLogic returned status: 500"));
    }

    @Test
    void testGetUsers_Exception() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Connection failed"));

        // Execute
        ResponseEntity<String> result = usersController.getUsers("json");

        // Verify
        assertEquals(HttpStatus.BAD_GATEWAY, result.getStatusCode());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic"));
    }

    @Test
    void testGetUserProperties_Success() throws Exception {
        // Setup
        String mockResponseBody = "{\"user-name\":\"admin\",\"description\":\"Administrator\",\"roles\":{\"role\":[\"admin\"]}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody); // Execute
        ResponseEntity<String> result = usersController.getUserProperties("admin", "json");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());

        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetUserProperties_DefaultFormat() throws Exception {
        // Setup
        String mockResponseBody = "<user-properties><user-name>admin</user-name><description>Administrator</description></user-properties>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute - no format parameter should default to xml
        ResponseEntity<String> result = usersController.getUserProperties("admin", null);

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetUserProperties_XmlFormat() throws Exception {
        // Setup
        String mockResponseBody = "<user-properties><user-name>admin</user-name><description>Administrator</description></user-properties>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute
        ResponseEntity<String> result = usersController.getUserProperties("admin", "xml");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetUserProperties_InvalidFormat() {
        // Execute - user properties doesn't support html format
        ResponseEntity<String> result = usersController.getUserProperties("admin", "html");

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetUserProperties_UserNotFound() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(404);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn("{\"error\":\"User not found\"}");

        // Execute
        ResponseEntity<String> result = usersController.getUserProperties("nonexistent", "json");

        // Verify
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertTrue(result.getBody().contains("MarkLogic returned status: 404"));
    }

    @Test
    void testGetUserProperties_MarkLogicError() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(500);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn("{\"error\":\"Internal server error\"}");

        // Execute
        ResponseEntity<String> result = usersController.getUserProperties("admin", "json");

        // Verify
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertTrue(result.getBody().contains("MarkLogic returned status: 500"));
    }

    @Test
    void testGetUserProperties_Exception() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Connection failed"));

        // Execute
        ResponseEntity<String> result = usersController.getUserProperties("admin", "json");

        // Verify
        assertEquals(HttpStatus.BAD_GATEWAY, result.getStatusCode());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic"));
    }

    @Test
    void testGetUserProperties_NoResponseBody() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.body()).thenReturn(null);

        // Execute
        ResponseEntity<String> result = usersController.getUserProperties("admin", "json");

        // Verify
        assertEquals(HttpStatus.BAD_GATEWAY, result.getStatusCode());
        assertTrue(result.getBody().contains("No response from MarkLogic server"));
    }
}
