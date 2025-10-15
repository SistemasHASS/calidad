import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DexieService } from '@/app/shared/dixiedb/dexie-db.service';
import { Configuracion } from '@/app/shared/interfaces/Tables';
import { MaestrasService } from '../../services/maestras.service';
import { UtilsService } from '@/app/shared/utils/utils.service';
import { AlertService } from '@/app/shared/alertas/alerts.service';
import { Usuario } from '@/app/shared/interfaces/Tables';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalidadService } from '../../services/calidad.service';

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [NgSelectModule, FormsModule, CommonModule],
  templateUrl: './parametros.component.html',
  styleUrl: './parametros.component.scss'
})
export class ParametrosComponent {

  constructor(
    private dexieService: DexieService,
    private maestrasService: MaestrasService,
    private utilsService: UtilsService,
    private alertService: AlertService,
    private calidadService: CalidadService
  ) {}

  configuracion: Configuracion = {
    id: '',
    idempresa: '',
    idfundo: '',
    idcultivo: ''
  }

  usuario: Usuario = {
    documentoidentidad: '',
    id: '',
    idproyecto: '',
    idrol: '',
    nombre: '',
    proyecto: '',
    razonSocial: '',
    rol: '',
    ruc: '',
    sociedad: 0,
    usuario: '',
    idempresa: ''
  }

  empresas: any[] = [];
  sedes: any[] = [];
  cultivos: any[] = [];
  fundos: any[] = [];
  showValidation: boolean = false;

  async ngOnInit() {
    await this.getUsuario()
    await this.validarExisteConfiguracion()
    await this.llenarDropdowns();
  }

  async getUsuario() {
    const usuario = await this.dexieService.showUsuario();
    if (usuario) { this.usuario = usuario } else { console.log('Error', 'Usuario not found', 'error');}
  }

  async validarExisteConfiguracion() {
    const configuracion = await this.dexieService.obtenerPrimeraConfiguracion();
    if(configuracion) {
      this.configuracion = configuracion;
    }
  }

  async llenarDropdowns() {
    await this.ListarEmpresas();
    await this.ListarFundos();
    await this.ListarCultivos();
  }

  async sincronizarTablasMaestras() {
    try {
      this.alertService.mostrarModalCarga();
      const empresas = await this.maestrasService.getEmpresas([])
      if(!!empresas && empresas.length) { 
        await this.dexieService.saveEmpresas(empresas)
        await this.ListarEmpresas()
      }

      const fundos = this.maestrasService.getFundos([{ idempresa: this.usuario.idempresa }])
      fundos.subscribe(async (resp: any) => {
        if (!!resp && resp.length) {
          await this.dexieService.saveFundos(resp);
          await this.ListarFundos();
          this.alertService.showAlert('Exito!', 'Sincronizado con exito', 'success');
        }
      })

      const cultivos = this.maestrasService.getCultivos([{idempresa: this.usuario?.idempresa}])
      cultivos.subscribe(async (resp: any) => {
        if(!!resp && resp.length) {
          await this.dexieService.saveCultivos(resp);
          await this.ListarCultivos();
        }
      });

      const trabajadores = this.maestrasService.getTrabajadores([{idempresa: this.usuario?.idempresa}])
      trabajadores.subscribe(async (resp: any) => {
        if(!!resp && resp.length) {
          this.alertService.cerrarModalCarga()
          await this.dexieService.saveTrabajadores(resp)
        }
      });

      const notas = this.calidadService.getNotasCampo([{ ruc: this.usuario.ruc, idrol: this.obtenerRol() }])
      notas.subscribe(async (resp: any) => {
        if(!!resp && resp.length) {
          await this.dexieService.saveEvaluaciones(resp)
        }
      });
    } catch (error: any) {
      console.error(error);
      this.alertService.showAlert('Error!', '<p>Ocurrio un error</p><p>', 'error');
    }
  }

  obtenerRol() {
    if(this.usuario.idrol.includes('SUCAL')) return 'SUCAL'
    if(this.usuario.idrol.includes('ASCAL')) return 'ASCAL'
    if(this.usuario.idrol.includes('PLCAL')) return 'PLCAL'
    if(this.usuario.idrol.includes('ADCAL')) return 'ADCAL'
    return ''
  }

  async ListarEmpresas() { 
    this.empresas = await this.dexieService.showEmpresas();
    this.configuracion.idempresa = this.empresas.find((empresa: any) => empresa.ruc === this.usuario.ruc)?.ruc || '';
  }

  async ListarFundos() { 
    const fundos = await this.dexieService.showFundos(); 
    const empresa = this.empresas.find((empresa: any) => empresa.ruc === this.usuario.ruc);
    this.fundos = fundos.filter((fundo: any) => fundo.empresa === empresa.empresa);
    if(this.fundos.length == 1){
      this.configuracion.idfundo = this.fundos[0].codigoFundo;
    } 
  }
  
  async ListarCultivos() { 
    const cultivos = await this.dexieService.showCultivos(); 
    const empresa = this.empresas.find((empresa: any) => empresa.ruc === this.usuario.ruc);
    this.cultivos = cultivos.filter((cultivo: any) => cultivo.empresa === empresa.empresa);
    if(this.cultivos.length == 1) {
      this.configuracion.idcultivo = this.cultivos[0].codigo;
    } 
  }
  
  async guardarConfiguracion() {
    this.showValidation = true;
    if(!this.configuracion.idempresa || !this.configuracion.idfundo || !this.configuracion.idcultivo) {
      this.alertService.showAlert('Advertencia!','Debe seleccionar todos los campos','warning')
    } else {
      this.configuracion.id = this.usuario.ruc+this.usuario.documentoidentidad;
      await this.dexieService.saveConfiguracion(this.configuracion)
      this.alertService.showAlert('¡Éxito!','La operación se completó correctamente','success')
    }
  }

}
