package com.example.marklogicadminproxy;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.ClassPathResource;

@Controller
public class CustomErrorController implements ErrorController {
    @RequestMapping(value = "/error", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> handleError(HttpServletRequest request) throws IOException {
        // Serve the static 404.html file from classpath
        String html;
        try {
            ClassPathResource resource = new ClassPathResource("static/404.html");
            byte[] bytes = resource.getInputStream().readAllBytes();
            html = new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            html = "<h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>";
        }
        return ResponseEntity.status(404).body(html);
    }
}
