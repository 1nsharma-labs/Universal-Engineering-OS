# Java 8 to 21 Cheatsheet

## Records (Immutable Data Carriers - Java 16+)
```java
public record UserDto(UUID id, String email, Instant createdAt) {}
```

## Pattern Matching for switch (Java 21)
```java
static String formatValue(Object obj) {
    return switch (obj) {
        case Integer i -> String.format("int %d", i);
        case Long l    -> String.format("long %d", l);
        case String s  -> String.format("string %s", s);
        case null      -> "null value";
        default        -> obj.toString();
    };
}
```

## Virtual Threads (Project Loom - Java 21)
```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> executor.submit(() -> {
        Thread.sleep(Duration.ofMillis(100));
        return i;
    }));
}
```
