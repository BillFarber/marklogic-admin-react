# MarkLogicAdminProxy

This is a Spring Boot project that acts as a proxy server for the MarkLogicAdminUI frontend. It forwards requests and can handle authentication (including Digest) to the MarkLogic backend.

## Getting Started

1. Make sure you have Java 17+ and Gradle installed (or use the included Gradle wrapper).
2. Install dependencies and run the server:

```bash
./gradlew bootRun
```

The proxy will listen on port 8080 by default. You can forward requests from your frontend to `http://localhost:8080/proxy/...`.

## Customization
- Update `ProxyController.java` to add more routes or authentication logic as needed.
- The MarkLogic backend target is currently set to `http://localhost:8002`.
