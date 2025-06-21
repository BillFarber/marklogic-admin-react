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

class RolesControllerTest {

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
    private RolesController rolesController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(rolesController, "marklogicHost", "localhost");
        ReflectionTestUtils.setField(rolesController, "marklogicSchema", "http");
    }

    @Test
    void testGetRoles_Success() throws Exception {
        // Setup
        String mockResponseBody = "{\"role-default-list\":{\"list-items\":{\"list-item\":[{\"nameref\":\"admin\",\"idref\":\"123\"}]}}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute
        ResponseEntity<String> result = rolesController.getRoles("json");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());

        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetRoles_DefaultFormat() throws Exception {
        // Setup
        String mockResponseBody = "<role-default-list><list-items><list-item><nameref>admin</nameref><idref>123</idref></list-item></list-items></role-default-list>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute - no format parameter should default to xml
        ResponseEntity<String> result = rolesController.getRoles(null);

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetRoles_XmlFormat() throws Exception {
        // Setup
        String mockResponseBody = "<role-default-list><list-items><list-item><nameref>admin</nameref><idref>123</idref></list-item></list-items></role-default-list>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute
        ResponseEntity<String> result = rolesController.getRoles("xml");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetRoles_HtmlFormat() throws Exception {
        // Setup
        String mockResponseBody = "<html><body><h1>Roles</h1></body></html>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute
        ResponseEntity<String> result = rolesController.getRoles("html");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.TEXT_HTML, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetRoles_InvalidFormat() {
        // Execute
        ResponseEntity<String> result = rolesController.getRoles("invalid");

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetRoles_MarkLogicError() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(500);

        // Execute
        ResponseEntity<String> result = rolesController.getRoles("json");

        // Verify
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertTrue(result.getBody().contains("MarkLogic returned status: 500"));
    }

    @Test
    void testGetRoles_Exception() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Connection failed"));

        // Execute
        ResponseEntity<String> result = rolesController.getRoles("json");

        // Verify
        assertEquals(HttpStatus.BAD_GATEWAY, result.getStatusCode());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic"));
    }

    @Test
    void testGetRoleProperties_Success() throws Exception {
        // Setup
        String mockResponseBody = "{\"role-name\":\"admin\",\"description\":\"Administrator role\",\"permissions\":{\"permission\":[{\"role-name\":\"security\",\"capability\":\"read\"}]}}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute
        ResponseEntity<String> result = rolesController.getRoleProperties("admin", "json");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());

        verify(okHttpClient).newCall(any(Request.class));
        verify(call).execute();
    }

    @Test
    void testGetRoleProperties_DefaultFormat() throws Exception {
        // Setup
        String mockResponseBody = "<role-properties><role-name>admin</role-name><description>Administrator role</description></role-properties>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute - no format parameter should default to xml
        ResponseEntity<String> result = rolesController.getRoleProperties("admin", null);

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetRoleProperties_XmlFormat() throws Exception {
        // Setup
        String mockResponseBody = "<role-properties><role-name>admin</role-name><description>Administrator role</description></role-properties>";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute
        ResponseEntity<String> result = rolesController.getRoleProperties("admin", "xml");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_XML, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }

    @Test
    void testGetRoleProperties_InvalidFormat() {
        // Execute
        ResponseEntity<String> result = rolesController.getRoleProperties("admin", "html");

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetRoleProperties_InvalidFormat_Random() {
        // Execute
        ResponseEntity<String> result = rolesController.getRoleProperties("admin", "invalid");

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Invalid format parameter"));
    }

    @Test
    void testGetRoleProperties_MarkLogicError() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(404);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn("{\"error\":\"Role not found\"}");

        // Execute
        ResponseEntity<String> result = rolesController.getRoleProperties("nonexistent", "json");

        // Verify
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertTrue(result.getBody().contains("MarkLogic returned status: 404"));
    }

    @Test
    void testGetRoleProperties_MarkLogicUnauthorized() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(false);
        when(response.code()).thenReturn(401);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn("{\"error\":\"Unauthorized\"}");

        // Execute
        ResponseEntity<String> result = rolesController.getRoleProperties("admin", "json");

        // Verify
        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        assertTrue(result.getBody().contains("MarkLogic returned status: 401"));
    }

    @Test
    void testGetRoleProperties_Exception() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenThrow(new RuntimeException("Connection failed"));

        // Execute
        ResponseEntity<String> result = rolesController.getRoleProperties("admin", "json");

        // Verify
        assertEquals(HttpStatus.BAD_GATEWAY, result.getStatusCode());
        assertTrue(result.getBody().contains("Failed to proxy to MarkLogic"));
    }

    @Test
    void testGetRoleProperties_NoResponseBody() throws Exception {
        // Setup
        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.body()).thenReturn(null);

        // Execute
        ResponseEntity<String> result = rolesController.getRoleProperties("admin", "json");

        // Verify
        assertEquals(HttpStatus.BAD_GATEWAY, result.getStatusCode());
        assertTrue(result.getBody().contains("No response from MarkLogic server"));
    }

    @Test
    void testGetRoleProperties_WithSpecialCharacters() throws Exception {
        // Setup
        String mockResponseBody = "{\"role-name\":\"test-role-123\",\"description\":\"Test role with special chars\"}";

        when(databaseClient.getClientImplementation()).thenReturn(okHttpClient);
        when(okHttpClient.newCall(any(Request.class))).thenReturn(call);
        when(call.execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(mockResponseBody);

        // Execute with role name containing special characters
        ResponseEntity<String> result = rolesController.getRoleProperties("test-role-123", "json");

        // Verify
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(MediaType.APPLICATION_JSON, result.getHeaders().getContentType());
        assertEquals(mockResponseBody, result.getBody());
    }
}
