package org.billFarber.marklogicadminproxy;

import com.marklogic.client.DatabaseClient;
import com.marklogic.client.DatabaseClientFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MarkLogicConfig {
    @Value("${marklogic.host}")
    private String host;

    @Value("${marklogic.port}")
    private int port;

    @Value("${marklogic.username}")
    private String username;

    @Value("${marklogic.password}")
    private String password;

    @Bean
    public DatabaseClient databaseClient() {
        return DatabaseClientFactory.newClient(
                host,
                port,
                new DatabaseClientFactory.DigestAuthContext(username, password));
    }
}
