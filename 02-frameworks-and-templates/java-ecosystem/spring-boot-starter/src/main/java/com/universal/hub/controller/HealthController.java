package com.universal.hub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "framework", "Spring Boot 3.2.4",
            "runtime", "Java " + System.getProperty("java.version"),
            "timestamp", Instant.now().toString()
        ));
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        return ResponseEntity.ok(Map.of(
            "service", "Universal-Dev-Hub Spring Microservice",
            "version", "1.0.0",
            "features", new String[]{"REST", "Actuator", "Virtual Threads Ready", "GraalVM Native Compatible"}
        ));
    }
}
