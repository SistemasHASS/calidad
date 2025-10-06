import { Component, ElementRef, ViewChild,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DexieService } from '@/app/shared/dixiedb/dexie-db.service';
import { AlertService } from '@/app/shared/alertas/alerts.service';
import { Evaluaciones } from '@/app/shared/interfaces/Tables';
import { UtilsService } from '@/app/shared/utils/utils.service';
import { TareoService } from '../../services/tareo.service';
@Component({
  selector: 'app-calidad-planta',
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './calidad-planta.component.html',
  styleUrl: './calidad-planta.component.scss'
})

export class CalidadPlantaComponent {
  currentDate: Date = new Date();
  lecturaRapida: boolean = true;
  trabajadores: any[] = [];
  evaluacion: Evaluaciones = {
    idevaluacion: '',
    ruc: '',
    fecha: '',
    dni: '',
    nota: 15,
    evaluador: 'EVELYN GUISELA',
    idrol: '',
    detalle: [
      {
        dia: 'SABADO',
        fecha: '11/10/2025',
        nota: 15
      },
      {
        dia: 'VIERNES',
        fecha: '10/10/2025',
        nota: 15
      },
      {
        dia: 'JUEVES',
        fecha: '09/10/2025',
        nota: 15
      },
      {
        dia: 'MIERCOLES',
        fecha: '08/10/2025',
        nota: 15
      },
      {
        dia: 'MARTES',
        fecha: '07/10/2025',
        nota: 15
      },
      {
        dia: 'LUNES',
        fecha: '06/10/2025',
        nota: 15
      }

    ]
  }
  usuario: any;
  search: string = '';
  sinenviar: number = 0;

  @ViewChild('dniInput') dniInputRef!: ElementRef<HTMLInputElement>;

  private focusIntervalId: any = null;
  evaluaciones: Evaluaciones[] = [
    {
      idevaluacion: '',
      ruc: '',
      fecha: '',
      dni: '',
      nota: 0,
      evaluador: '',
      idrol: '',
      detalle: []
    }
  ];

  activeSection: number | null = 1;

  constructor(
    private utilsService: UtilsService,
    private dexieService: DexieService,
    private alertService: AlertService,
    private tareoService: TareoService,
    private cd: ChangeDetectorRef
  ){}

  ngAfterViewInit() {
    this.handleLecturaRapida(); // inicial
  }

  async ngOnInit(){
    await this.ObtenerUsuario()
    await this.ListarTrabajadores()
  }

  async ObtenerUsuario() {
    this.usuario = await this.dexieService.showUsuario()
  }

  onLecturaRapidaChange() {
    this.handleLecturaRapida();
  }

  handleLecturaRapida() {
    if (this.lecturaRapida) {
      this.startAutoFocus();
    } else {
      this.stopAutoFocus();
    }
  }

  startAutoFocus() {
    this.stopAutoFocus(); // previene duplicados

    this.focusIntervalId = setInterval(() => {
      const input = this.dniInputRef?.nativeElement;
      if (input && document.activeElement !== input) {
        input.focus();
      }
    }, 500);
  }

  stopAutoFocus() {
    if (this.focusIntervalId) {
      clearInterval(this.focusIntervalId);
      this.focusIntervalId = null;
    }
  }

  ngOnDestroy() {
    this.stopAutoFocus();
  }

  async agregarPersona(alerta: boolean =  false) {
    if(alerta) {
      this.alertService.showAlert('Agregando persona', 'Procesando', 'info');
    }
  }

  async guardarTrabajador(t: any) {
    
  }

  async ListarTrabajadores() {
    
  }

  actualizarSinenviar() {
    this.sinenviar = this.trabajadores.filter((e: any) => e.estado == 0).length
  }

  onDniChange(value: string) {
    if (this.lecturaRapida) {
      const isDniValido = /^\d{8,9}$/.test(value); // Solo 8 o 9 dígitos exactos
      if (isDniValido) {
        /*TODO: */
        setTimeout(() => {
          this.search = '';
          this.dniInputRef.nativeElement.value = '';
          this.cd.detectChanges();
        }, 0);
        /*TODO: */
        this.agregarPersona();
      }
    }
  }

  async sincronizar() {
    
  }

  toggleSection(section: number) {
    this.activeSection = this.activeSection == section ? null : section;
  }
}
