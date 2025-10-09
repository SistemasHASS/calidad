import { Component, ElementRef, ViewChild,ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DexieService } from '@/app/shared/dixiedb/dexie-db.service';
import { AlertService } from '@/app/shared/alertas/alerts.service';
import { UtilsService } from '@/app/shared/utils/utils.service';
import { CalidadService } from '../../services/calidad.service';
import { NotaPersona, Evaluaciones } from '@/app/shared/interfaces/Tables';
import { Modal } from 'bootstrap';
import { BrowserQRCodeReader } from '@zxing/library';

@Component({
  selector: 'app-calidad-campo',
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './calidad-campo.component.html',
  styleUrl: './calidad-campo.component.scss'
})
export class CalidadCampoComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('beepSound') beepSound!: ElementRef<HTMLAudioElement>;
  @ViewChild('modalNota') modalNota!: ElementRef;
  modalNotaInstance!: Modal;
  @ViewChild('dniInput') dniInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('modalScanner') modalScanner!: ElementRef;
  modalScannerInstance!: Modal;

  @Input() enableScanner: boolean = false;

  usuario: any;
  activeSection: number | null = 1;
  mensajeObligatorio: boolean = false;
  search: string = '';
  currentDate: Date = new Date();
  /***/
  trabajadores: any[] = [];
  evaluaciones: Evaluaciones[] = [];
  /***/
  notaPersona: NotaPersona = {
    idevaluacion: '',
    ruc: '',
    fecha: '',
    dni: '',
    nota: 0,
    evaluador: '',
    idrol: '',
    estado: 0
  }

  evaluacion: Evaluaciones = {
    id: '',
    ruc: '',
    dni: '',
    nombre: '',
    promedio: 0,
    detalle: []
  }

  // scannerControls: IScannerControls | null = null;
  qrCodeReader = new BrowserQRCodeReader();
  qrResult: string = '';
  lastResult: string = '';
  cameraError = false;
  cameraStream: MediaStream | null = null;

  constructor(
    private utilsService: UtilsService,
    private dexieService: DexieService,
    private alertService: AlertService,
    private calidadService: CalidadService,
    private cd: ChangeDetectorRef
  ){}

  ngAfterViewInit() {
    this.modalNotaInstance = new Modal(this.modalNota.nativeElement);
    this.modalScannerInstance = new Modal(this.modalScanner.nativeElement);
  }

  async ngOnInit() {
    await this.ObtenerUsuario()
    await this.ListarTrabajadores()
    await this.ListarEvaluaciones()
    await this.iniciarNota()
  }

  async ObtenerUsuario() {
    this.usuario = await this.dexieService.showUsuario()
  }

  async ListarTrabajadores() {
    this.trabajadores = await this.dexieService.showTrabajadores()
  }

  async ListarEvaluaciones() {
    this.evaluaciones = await this.dexieService.showEvaluaciones()
  }

  async iniciarNota() {
    this.notaPersona.fecha = this.utilsService.formatDate3(new Date())
    this.notaPersona.nota = 15
  }

  async agregarPersona(alerta: boolean =  false) {
    if(alerta) {
      this.alertService.showAlert('Agregando persona', 'Procesando', 'info');
    }
  }

  async buscarPersona(alerta: boolean =  false) {
    this.clearEvaluacion()
    if(this.search != '') {
      const trabajadorbd = this.trabajadores.find((item:any)=> item.nrodocumento.trim() == this.search.trim())
      if(trabajadorbd) {
        if(trabajadorbd.bloqueado == 1) {
          this.search = ''
          if(alerta) this.alertService.showAlertAcept('Alerta!',`Usuario restringido`,'warning')
        } else {
          this.search = ''
          this.llenarEvaluacion(trabajadorbd)
          this.alertService.showAlert('Exito!', 'Encontrado con exito', 'success');
        }
      } else {
        if(alerta) this.alertService.showAlert('Alerta!','Usuario no encontrado','warning')
        this.search = ''
      }
    } else {
      this.alertService.showAlert('Alerta!', 'Debe ingresar un dni', 'warning');
    }
  }

  clearEvaluacion() {
    this.evaluacion = {
      id: '',
      ruc: '',
      dni: '',
      nombre: '',
      promedio: 0,
      detalle: []
    }
  }

  obtenerPromedio() {
    let promedio = 0
    this.evaluacion.detalle.forEach((item:any)=> {
      promedio += item.nota
    })
    return promedio/this.evaluacion.detalle.length || 0
  }

  async llenarEvaluacion(t: any) {
    const evaluaciones = await this.dexieService.showEvaluaciones()
    const evaluacion = evaluaciones.find( (e: any) => e.dni == t.nrodocumento ) 
    if(evaluacion) {
      this.evaluacion = evaluacion
    } else {
      this.evaluacion = {
        id: t.ruc+t.nrodocumento,
        ruc: t.ruc,
        dni: t.nrodocumento,
        nombre: t.nombre,
        promedio: 0,
        detalle: []
      }
    }
  }

  async guardarTrabajador(t: any) {
    
  }

  async sincronizar() {
    if(this.evaluacion.detalle.length==0) {
      this.alertService.showAlert('Alerta!', 'Debe ingresar al menos una nota', 'warning');
      return;
    }
    const confirmacion = await this.alertService.showConfirm('Confirmación', '¿Desea enviar los datos?', 'warning');
    if(confirmacion) {
      const formatoNotas = this.formatoNotasEvaluacion()
      this.calidadService.registrarNota(formatoNotas).subscribe((res:any)=> {
        if(res[0].errorgeneral == 0) {
          for(let i = 0; i < this.evaluacion.detalle.length; i++) {
            this.evaluacion.detalle[i].estado = 1
          }
          this.dexieService.saveEvaluacion(this.evaluacion)
          this.alertService.showAlert('Exito!', 'Datos enviados con exito', 'success');
        } else {
          this.alertService.showAlert('Alerta!', 'Error al enviar los datos', 'warning');
        }
      })
    }
  }

  formatoNotasEvaluacion() {
    const notas = this.evaluacion.detalle.map((item:any)=> {
      return {
        idevaluacion: item.idevaluacion,
        ruc: item.ruc,
        fecha: item.fecha,
        dni: item.dni,
        nota: item.nota,
        evaluador: item.evaluador,
        idrol: item.idrol
      }
    })
    return notas.filter((item:any)=> item.estado == 0)
  }

  toggleSection(section: number) {
    this.activeSection = this.activeSection == section ? null : section;
  }

  async agregarNota() {
    if(this.evaluacion.dni == '') {
      this.alertService.showAlert('Alerta!', 'Debe ingresar un dni', 'warning');
      return;
    }
    if(this.evaluacion.detalle.length>0 && this.validarNotaHoy()) {
      this.alertService.showAlert('Alerta!', 'Ya se registro una nota', 'warning');
      return;
    }
    this.modalNotaInstance.show();
  }

  validarNotaHoy() {
    const fechaHoy = this.utilsService.formatDate3(new Date())
    const notaHoy = this.evaluacion.detalle.find((item:any)=> item.fecha == fechaHoy)
    return notaHoy
  }

  async guardarNota() {
    this.modalNotaInstance.hide();
    this.notaPersona.idevaluacion = this.usuario.ruc+this.usuario.documentoidentidad+this.utilsService.formatoAnioMesDiaHoraMinSec();
    this.notaPersona.ruc = this.usuario.ruc;
    this.notaPersona.dni = this.evaluacion.dni;
    this.notaPersona.evaluador = this.usuario.documentoidentidad;
    this.notaPersona.idrol = this.obtenerRol(this.usuario.idrol);
    this.evaluacion.detalle.push(this.notaPersona)
    await this.dexieService.saveEvaluacion(this.evaluacion)
    this.alertService.showAlert('Exito!', 'Nota guardada', 'success');
    this.clearNota()
  }

  clearNota() {
    this.notaPersona = {
      idevaluacion: '',
      ruc: '',
      fecha: '',
      dni: '',
      nota: 0,
      evaluador: '',
      idrol: '',
      estado: 0
    }
  }

  obtenerRol(idrol: string) {
   switch (idrol) {
    case 'SUCAL': {
      return 'SUCAL';
    }
    case 'ADCAL': {
      return 'ADCAL';
    }
    default: {
      return 'SUCAL';
    }
   } 
  }

  validarRango(event: any) {
    let valor = Number(event.target.value);
  
    if (valor < 0) valor = 0;
    else if (valor > 20) valor = 20;
  
    event.target.value = valor;
    this.notaPersona.nota = valor;
  }

  detectarDia(fecha: string) {
    return this.utilsService.formatoNombreDia(fecha);
  }

  abrirModal() {
    this.modalScannerInstance.show();
    this.startCamera();
  }

  async startCamera() {
    try {
      if (this.cameraStream) {
        this.stopCamera();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      this.cameraStream = stream;
      const video = this.videoElement.nativeElement;

      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      await video.play();

      this.scanQRCode();
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      this.cameraError = true;
    }
  }

  async scanQRCode() {
    try {
      await this.qrCodeReader.decodeFromVideoDevice(
        '',
        this.videoElement.nativeElement,
        (result: any, err: any) => {
          if (result) {
            this.playBeep();
            this.onCodeResult(result.text);
          }
        }
      );
    } catch (error) {
      console.error('Error iniciando el scanner:', error);
    }
  }

  async onCodeResult(result: any ='') {
    const { dniExtraido, mensaje } = this.validarQrDni(result);
    if(dniExtraido) {
      this.search = dniExtraido
      await this.buscarPersona(false)
    } else {
      this.alertService.showAlertAcept('Alerta', 'Ocurrio un error: ['+mensaje+']','warning');
    }
    this.closeModalCamara();
  }

  closeModalCamara(): void {
    this.stopCamera();
    this.modalScannerInstance.hide();
  }

  validarQrDni(resultado: any): { dniExtraido: string | null, mensaje: string } {
    const texto = resultado?.toString().trim() ?? '';
    const indiceD = texto.indexOf('D');
    const indiceC = texto.indexOf('C');

    if (indiceD === -1 || indiceC === -1 || indiceC < indiceD) {
      return { dniExtraido: null, mensaje: 'estructura qr no valida' };
    }
  
    const dniExtraido = texto.substring(indiceD + 1, indiceC).trim();
    return { dniExtraido, mensaje: dniExtraido || 'estructura qr no valida' };
  }
  

  stopCamera() {
    this.qrCodeReader.reset();
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    const video = this.videoElement.nativeElement;
    video.pause();
    video.srcObject = null;
  }

  playBeep() {
    const beep = this.beepSound.nativeElement;
    beep.currentTime = 0;
    beep.play();
  }
  
}
