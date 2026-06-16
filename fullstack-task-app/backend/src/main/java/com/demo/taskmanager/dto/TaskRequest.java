package com.demo.taskmanager.dto;

import com.demo.taskmanager.model.Priority;
import com.demo.taskmanager.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Payload accepted when creating or updating a task.
 */
public record TaskRequest(
        @NotBlank(message = "title is required")
        @Size(max = 120, message = "title must be at most 120 characters")
        String title,

        @Size(max = 1000, message = "description must be at most 1000 characters")
        String description,

        @NotNull(message = "status is required")
        TaskStatus status,

        @NotNull(message = "priority is required")
        Priority priority,

        LocalDate dueDate
) {
}
