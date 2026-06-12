import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ForbiddenPageComponent } from './forbidden.page';

describe('ForbiddenPageComponent', () => {
  let fixture: ComponentFixture<ForbiddenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForbiddenPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ForbiddenPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the forbidden message', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Kein Zugriff');
  });
});