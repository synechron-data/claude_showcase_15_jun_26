package com.demo.taskmanager.config;

import com.demo.taskmanager.model.Priority;
import com.demo.taskmanager.model.Task;
import com.demo.taskmanager.model.TaskStatus;
import com.demo.taskmanager.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds a few demo tasks on startup so the UI has data to show.
 * Disabled under the "test" profile to keep tests deterministic.
 */
@Configuration
@Profile("!test")
public class DataSeeder {

    @Bean
    CommandLineRunner seedTasks(TaskRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }
            repository.saveAll(List.of(
                    new Task("Set up CI pipeline", "Configure GitHub Actions for build and test",
                            TaskStatus.IN_PROGRESS, Priority.HIGH, LocalDate.now().plusDays(2)),
                    new Task("Write API documentation", "Document all REST endpoints with examples",
                            TaskStatus.TODO, Priority.MEDIUM, LocalDate.now().plusDays(5)),
                    new Task("Design landing page", "Create mockups for the marketing site",
                            TaskStatus.TODO, Priority.LOW, LocalDate.now().plusDays(10)),
                    new Task("Fix login redirect bug", "Users land on a blank page after sign-in",
                            TaskStatus.DONE, Priority.HIGH, LocalDate.now().minusDays(1))
            ));
        };
    }
}
