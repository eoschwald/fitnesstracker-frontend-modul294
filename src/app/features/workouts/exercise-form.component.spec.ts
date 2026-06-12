import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseFormComponent } from './exercise-form.component';
import { Exercise, ExerciseRequest } from '../../core/models/workout.model';

describe('ExerciseFormComponent', () => {
  let fixture: ComponentFixture<ExerciseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseFormComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('patches the form when an exercise is provided', () => {
    const exercise = {
      id: 1,
      name: 'Bench',
      repetitions: 10,
      durationInMinutes: 20,
      weight: 40,
      workoutId: 7
    } as Exercise;

    fixture.componentInstance.exercise = exercise;
    fixture.componentInstance.ngOnChanges();

    expect(fixture.componentInstance.form.value.name).toBe('Bench');
    expect(fixture.componentInstance.form.value.repetitions).toBe(10);
  });

  it('emits the exercise payload on submit', () => {
    const emitted: ExerciseRequest[] = [];
    fixture.componentInstance.saveExercise.subscribe((value) => emitted.push(value));

    fixture.componentInstance.form.setValue({
      name: 'Squat',
      repetitions: 8,
      durationInMinutes: 30,
      weight: 60
    });

    fixture.componentInstance.submit();

    expect(emitted).toEqual([
      {
        name: 'Squat',
        repetitions: 8,
        durationInMinutes: 30,
        weight: 60
      }
    ]);
  });

  it('emits resetRequested when clicked', () => {
    const emitted: boolean[] = [];
    fixture.componentInstance.resetRequested.subscribe(() => emitted.push(true));

    fixture.nativeElement.querySelector('button[type="button"]').click();

    expect(emitted).toEqual([true]);
  });
});