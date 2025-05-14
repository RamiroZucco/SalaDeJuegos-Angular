import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorDetectorComponent } from './color-detector.component';

describe('ColorDetectorComponent', () => {
  let component: ColorDetectorComponent;
  let fixture: ComponentFixture<ColorDetectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorDetectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
