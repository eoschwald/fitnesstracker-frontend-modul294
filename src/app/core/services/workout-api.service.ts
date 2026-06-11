import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Exercise, ExerciseRequest, Workout, WorkoutRequest } from '../models/workout.model';

@Injectable({ providedIn: 'root' })
export class WorkoutApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/workouts`;

  getAll(): Observable<Workout[]> {
    return this.http.get<Workout[]>(this.baseUrl);
  }

  getById(id: number): Observable<Workout> {
    return this.http.get<Workout>(`${this.baseUrl}/${id}`);
  }

  create(request: WorkoutRequest): Observable<Workout> {
    return this.http.post<Workout>(this.baseUrl, request);
  }

  update(id: number, request: WorkoutRequest): Observable<Workout> {
    return this.http.put<Workout>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getExercises(workoutId: number): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.baseUrl}/${workoutId}/exercises`);
  }

  addExercise(workoutId: number, request: ExerciseRequest): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.baseUrl}/${workoutId}/exercises`, request);
  }

  removeExercise(workoutId: number, exerciseId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${workoutId}/exercises/${exerciseId}`);
  }
}
