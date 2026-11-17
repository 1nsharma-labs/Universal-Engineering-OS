package com.universal.hub;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.serde.annotation.Serdeable;

import java.time.Instant;
import java.util.Map;

@Controller("/api/micronaut")
public class MicronautController {

    @Get("/status")
    public Map<String, Object> getStatus() {
        return Map.of(
            "framework", "Micronaut 4.3.8",
            "architecture", "Ahead-of-Time (AoT) Compilation",
            "reflectionFree", true,
            "timestamp", Instant.now().toString()
        );
    }
}
