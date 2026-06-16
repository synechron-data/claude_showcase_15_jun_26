package com.demo.taskmanager.service;

/**
 * Raised when a task cannot be located by id.
 */
public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(Long id) {
        super("Task not found with id " + id);
    }
}
