import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalidadAseguramientoComponent } from './calidad-aseguramiento.component';

describe('CalidadAseguramientoComponent', () => {
  let component: CalidadAseguramientoComponent;
  let fixture: ComponentFixture<CalidadAseguramientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalidadAseguramientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalidadAseguramientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
