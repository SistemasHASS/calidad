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
    private alertService: AlertService
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
  }

  async getUsuario() {
    const usuario = await this.dexieService.showUsuario();
    if (usuario) { this.usuario = usuario } else { console.log('Error', 'Usuario not found', 'error');}
  }

  async validarExisteConfiguracion() {
    const configuracion = await this.dexieService.obtenerPrimeraConfiguracion();
    if(configuracion) {
      this.configuracion = configuracion;
      await this.llenarDropdowns();
    }
  }

  async llenarDropdowns() {
    this.empresas = await this.dexieService.showEmpresas();
    this.sedes = await this.dexieService.showFundos();
    this.cultivos = await this.dexieService.showCultivos();
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
        if(!!resp && resp.length) {
          await this.dexieService.saveFundos(resp);
          await this.ListarFundos();
        }
      });

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
          await this.dexieService.saveTrabajadores(resp)
        }
      });
    } catch (error: any) {
      console.error(error);
      this.alertService.showAlert('Error!', '<p>Ocurrio un error</p><p>' + error + '</p>', 'error');
    }
  }

  async ListarEmpresas() { 
    this.empresas = await this.dexieService.showEmpresas();
    this.configuracion.idempresa = this.empresas.find((empresa: any) => empresa.ruc === this.usuario.ruc)?.ruc || '';
  }
  async ListarFundos() { 
    this.sedes = await this.dexieService.showFundos(); 
    if(this.sedes.length == 1){
      this.configuracion.idfundo = this.sedes[0].codigoFundo;
    } 
  }
  async ListarCultivos() { this.cultivos = await this.dexieService.showCultivos(); }
  
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
