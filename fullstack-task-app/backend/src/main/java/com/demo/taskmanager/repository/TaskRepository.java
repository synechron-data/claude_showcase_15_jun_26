package com.demo.taskmanager.repository;

import com.demo.taskmanager.model.Task;
import com.demo.taskmanager.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data repository for {@link Task} entities.
 */
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatusOrderByCreatedAtDesc(TaskStatus status);

    List<Task> findAllByOrderByCreatedAtDesc();
}
