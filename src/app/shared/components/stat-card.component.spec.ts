import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the label, value and hint', () => {
    fixture.componentInstance.label = 'Workouts';
    fixture.componentInstance.value = '12';
    fixture.componentInstance.hint = 'alle Trainings';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Workouts');
    expect(fixture.nativeElement.textContent).toContain('12');
    expect(fixture.nativeElement.textContent).toContain('alle Trainings');
  });
});