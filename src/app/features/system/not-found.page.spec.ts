import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundPageComponent } from './not-found.page';

describe('NotFoundPageComponent', () => {
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the 404 text', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('404');
    expect(fixture.nativeElement.textContent).toContain('Zum Dashboard');
  });
});