import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalidadPlantaComponent } from './calidad-planta.component';

describe('CalidadPlantaComponent', () => {
  let component: CalidadPlantaComponent;
  let fixture: ComponentFixture<CalidadPlantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalidadPlantaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalidadPlantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
