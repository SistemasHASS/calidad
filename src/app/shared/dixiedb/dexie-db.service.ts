import { Injectable } from '@angular/core';
import { Usuario,Configuracion,Fundo,Cultivo,Trabajador,Empresa, Evaluaciones} from '../interfaces/Tables'
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})

export class DexieService extends Dexie {

  public configuracion!: Dexie.Table<Configuracion, string>;
  public usuario!: Dexie.Table<Usuario, number>;
  public empresas!: Dexie.Table<Empresa, number>;
  public fundos!: Dexie.Table<Fundo, number>;
  public cultivos!: Dexie.Table<Cultivo, number>;
  public trabajadores!: Dexie.Table<Trabajador, string>;
  public evaluaciones!: Dexie.Table<Evaluaciones, string>;
  
  constructor() {
    super('Calidad');
    console.log('DexieService Constructor - Base de datos inicializada');
    this.version(1).stores({
      configuracion: `id,idempresa,idsede,idcultivo`,
      empresas: `id,ruc,razonsocial`,
      usuario: `id,sociedad,ruc,razonSocial,idProyecto,proyecto,documentoIdentidad,usuario,
      clave,nombre,idrol,rol`,
      fundos: `id,codigoFundo,empresa,fundo,nombreFundo`,
      cultivos: `id,cultivo,codigo,descripcion,empresa`,
      trabajadores: `id,ruc,nrodocumento,nombres,apellidopaterno,apellidomaterno,estado,motivo,
      bloqueado,eliminado,idmotivo,motivosalida`,
      evaluaciones: `id,ruc,dni,nombre,promedio,detalle`,
    });

    this.usuario = this.table('usuario');
    this.configuracion = this.table('configuracion');
    this.empresas = this.table('empresas');
    this.fundos = this.table('fundos');
    this.cultivos = this.table('cultivos');
    this.trabajadores = this.table('trabajadores')
    this.evaluaciones = this.table('evaluaciones')
  }

  //
  async saveConfiguracion(configuracion: Configuracion) { await this.configuracion.put(configuracion); }
  async obtenerConfiguracion() {return await this.configuracion.toArray();} 
  async obtenerPrimeraConfiguracion() { return await this.configuracion.toCollection().first(); }
  async clearConfiguracion() {await this.configuracion.clear();}
  //
  async saveEmpresa(empresa: Empresa) {await this.empresas.put(empresa);}
  async saveEmpresas(empresas: Empresa[]) {await this.empresas.bulkPut(empresas);}
  async showEmpresas() {return await this.empresas.orderBy('razonsocial').toArray();}
  async showEmpresaById(id: number) {return await this.empresas.where('id').equals(id).first()}
  async clearEmpresas() {await this.empresas.clear();}
  //
  async saveUsuario(usuario: Usuario) {await this.usuario.put(usuario);}
  async showUsuario() {return await this.usuario.toCollection().first()}
  async clearUsuario() {await this.usuario.clear();}
  //
  async saveFundo(fundo: Fundo) {await this.fundos.put(fundo);}
  async saveFundos(fundos: Fundo[]) {await this.fundos.bulkPut(fundos);}
  async showFundos() {return await this.fundos.toArray();}
  async showFundoById(id: number) {return await this.fundos.where('id').equals(id).first()}
  async clearFundos() {await this.fundos.clear();}
  //
  async saveCultivo(cultivo: Cultivo) {await this.cultivos.put(cultivo);}  
  async saveCultivos(cultivos: Cultivo[]) {await this.cultivos.bulkPut(cultivos);}
  async showCultivos() {return await this.cultivos.toArray();}
  async showCultivoById(id: number) {return await this.cultivos.where('id').equals(id).first()}
  async clearCultivos() {await this.cultivos.clear();}
  //
  async saveTrabajadores(params: Trabajador[]) {await this.trabajadores.bulkPut(params);}
  async saveTrabajador(params: Trabajador) {await this.trabajadores.put(params);}
  async showTrabajadorById(id: any) { return await this.trabajadores.where('id').equals(id).first(); }
  async showTrabajadores() { return await this.trabajadores.toArray(); }
  async deleteTrabajador(id: any) { return await this.trabajadores.where('id').equals(id).delete(); }
  async clearTrabajadores() {await this.trabajadores.clear();}
  //
  async saveEvaluaciones(evaluaciones: Evaluaciones[]) {await this.evaluaciones.bulkPut(evaluaciones);}
  async saveEvaluacion(evaluacion: Evaluaciones) {await this.evaluaciones.put(evaluacion);}
  async showEvaluaciones() {return await this.evaluaciones.toArray();}
  async showEvaluacionById(id: string) {return await this.evaluaciones.where('id').equals(id).first()}
  async clearEvaluaciones() {await this.evaluaciones.clear();}
  //
  async clearMaestras() {
    await this.clearFundos();
    await this.clearCultivos();
    await this.clearEmpresas();
    await this.clearTrabajadores();
    await this.clearUsuario();
    await this.clearConfiguracion();
    await this.clearEvaluaciones();
    console.log('Todas las tablas de configuracion han sido limpiadas en indexedDB.');
  }

}