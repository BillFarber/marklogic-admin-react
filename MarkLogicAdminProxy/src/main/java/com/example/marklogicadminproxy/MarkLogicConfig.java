package com.example.marklogicadminproxy;

import com.marklogic.client.DatabaseClient;
import com.marklogic.client.DatabaseClientFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MarkLogicConfig {
    @Value("${marklogic.host}")
    private String host;

    @Value("${marklogic.username}")
    private String username;

    @Value("${marklogic.password}")
    private String password;

    @Bean
    public DatabaseClient databaseClient() {
        // Assumes default port 8000 and Digest authentication
        return DatabaseClientFactory.newClient(
                host,
                8000,
                new DatabaseClientFactory.DigestAuthContext(username, password));
    }
}
