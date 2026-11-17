package com.universal.hub;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class JavaFXApp extends Application {

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Universal Dev Hub - JavaFX 21 GUI");

        Label header = new Label("Universal Dev Hub Desktop");
        header.setStyle("-fx-font-size: 22px; -fx-font-weight: bold; -fx-text-fill: #1e293b;");

        Label counterLabel = new Label("Interactions: 0");
        counterLabel.setStyle("-fx-font-size: 16px; -fx-text-fill: #475569;");

        final int[] count = {0};
        Button actionButton = new Button("Trigger Native Event");
        actionButton.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-size: 14px; -fx-padding: 8 16; -fx-background-radius: 6;");
        actionButton.setOnAction(e -> {
            count[0]++;
            counterLabel.setText("Interactions: " + count[0]);
        });

        VBox layout = new VBox(15, header, counterLabel, actionButton);
        layout.setAlignment(Pos.CENTER);
        layout.setPadding(new Insets(40));
        layout.setStyle("-fx-background-color: #f8fafc;");

        Scene scene = new Scene(layout, 500, 350);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
