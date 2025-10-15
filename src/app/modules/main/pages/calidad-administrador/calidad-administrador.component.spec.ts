import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalidadAdministradorComponent } from './calidad-administrador.component';

describe('CalidadAdministradorComponent', () => {
  let component: CalidadAdministradorComponent;
  let fixture: ComponentFixture<CalidadAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalidadAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalidadAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
