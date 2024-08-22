import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThFilterableComponent } from './th-filterable.component';

describe('ThFilterableComponent', () => {
  let component: ThFilterableComponent;
  let fixture: ComponentFixture<ThFilterableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThFilterableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThFilterableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
