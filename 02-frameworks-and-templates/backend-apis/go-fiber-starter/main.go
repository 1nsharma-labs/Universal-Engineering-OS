package main

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

type HealthResponse struct {
	Status    string    `json:"status"`
	Framework string    `json:"framework"`
	Runtime   string    `json:"runtime"`
	Timestamp time.Time `json:"timestamp"`
}

func main() {
	app := fiber.New(fiber.Config{
		ServerHeader: "Universal-Dev-Hub",
		AppName:      "Go-Fiber Microservice v1.0",
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(HealthResponse{
			Status:    "healthy",
			Framework: "Go-Fiber v2",
			Runtime:   "Golang 1.22",
			Timestamp: time.Now().UTC(),
		})
	})

	app.Get("/api/v1/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})

	log.Println("Go-Fiber microservice listening on :8083")
	log.Fatal(app.Listen(":8083"))
}
