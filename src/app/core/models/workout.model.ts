export interface Exercise {
  id: number;
  name: string;
  repetitions: number | null;
  durationInMinutes: number | null;
  weight: number | null;
  workoutId?: number | null;
}

export interface Workout {
  id: number;
  title: string;
  description: string | null;
  workoutDate: string;
  userId: number;
  exercises: Exercise[];
}

export interface WorkoutRequest {
  title: string;
  description: string | null;
  workoutDate: string;
  userId: number;
}

export interface ExerciseRequest {
  name: string;
  repetitions: number | null;
  durationInMinutes: number | null;
  weight: number | null;
}
