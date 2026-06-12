import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders title and subtitle', () => {
    fixture.componentInstance.title = 'Hello';
    fixture.componentInstance.subtitle = 'World';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Hello');
    expect(fixture.nativeElement.textContent).toContain('World');
  });
});