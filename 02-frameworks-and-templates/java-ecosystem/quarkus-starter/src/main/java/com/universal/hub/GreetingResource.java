package com.universal.hub;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.time.Instant;
import java.util.Map;

@Path("/api/quarkus")
public class GreetingResource {

    @GET
    @Path("/hello")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> hello() {
        return Map.of(
            "framework", "Quarkus 3.8.3",
            "message", "Supersonic Subatomic Java",
            "nativeOptimized", true,
            "timestamp", Instant.now().toString()
        );
    }
}
