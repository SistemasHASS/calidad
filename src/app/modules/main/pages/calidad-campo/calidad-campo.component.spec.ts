import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalidadCampoComponent } from './calidad-campo.component';

describe('CalidadCampoComponent', () => {
  let component: CalidadCampoComponent;
  let fixture: ComponentFixture<CalidadCampoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalidadCampoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalidadCampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
