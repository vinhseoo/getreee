package com.gatre;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GaTreApplication {

    public static void main(String[] args) {
        SpringApplication.run(GaTreApplication.class, args);
    }
}
