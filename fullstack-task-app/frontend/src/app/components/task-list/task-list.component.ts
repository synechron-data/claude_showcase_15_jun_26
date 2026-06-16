import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TaskService } from '../../services/task.service';
import {
  PRIORITIES,
  Priority,
  TASK_STATUSES,
  Task,
  TaskStatus
} from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);

  readonly statuses = TASK_STATUSES;
  readonly priorities = PRIORITIES;

  tasks: Task[] = [];
  loading = false;
  error: string | null = null;

  /** Currently active status filter, or null for "all". */
  filter: TaskStatus | null = null;

  /** Id of the task being edited, or null when creating a new one. */
  editingId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(1000)]],
    status: ['TODO' as TaskStatus, Validators.required],
    priority: ['MEDIUM' as Priority, Validators.required],
    dueDate: ['']
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.taskService.list(this.filter ?? undefined).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load tasks. Is the backend running on :8080?';
        this.loading = false;
      }
    });
  }

  setFilter(status: TaskStatus | null): void {
    this.filter = status;
    this.load();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      title: value.title.trim(),
      description: value.description.trim() || null,
      status: value.status,
      priority: value.priority,
      dueDate: value.dueDate || null
    };

    const request$ = this.editingId
      ? this.taskService.update(this.editingId, payload)
      : this.taskService.create(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.load();
      },
      error: () => {
        this.error = 'Could not save the task.';
      }
    });
  }

  edit(task: Task): void {
    this.editingId = task.id;
    this.form.setValue({
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? ''
    });
  }

  remove(task: Task): void {
    if (!confirm(`Delete "${task.title}"?`)) {
      return;
    }
    this.taskService.delete(task.id).subscribe({
      next: () => this.load(),
      error: () => {
        this.error = 'Could not delete the task.';
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: ''
    });
  }

  trackById(_index: number, task: Task): number {
    return task.id;
  }
}
