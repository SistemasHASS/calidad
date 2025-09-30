import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TareoService {

  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  enviarTareo(params: any): Observable<any> {
    const url = `${this.baseUrl}/tareo`;
    const body = { id: "1", jsonData: params}
    try {
      return this.http.post<any>(url, body);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al enviar el tareo');
    }
  }

  enviarPlanillaAdicional(params: any): Observable<any> {
    const url = `${this.baseUrl}/tareo/planillaadicional`;
    const body = { id: "1", jsonData: params}
    try {
      return this.http.post<any>(url, body);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al enviar la planilla adicional');
    }
  }

  enviarIncidenciasPersona(params: any): Observable<any> {
    const url = `${this.baseUrl}/tareo/incidenciaspersona`;
    const body = { id: "1", jsonData: params}
    try {
      return this.http.post<any>(url, body);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al enviar las incidencias');
    }
  }

  async getIncidenciasAprobar(params: any): Promise<any> {
    const url = `${this.baseUrl}/tareo/incidenciasaprobacion/nuevo`;
    try {
      let httpParams = new HttpParams();
      const paramsString = JSON.stringify(params)
      httpParams = httpParams.set('parametros', paramsString);
      return await lastValueFrom(this.http.get<any>(url, { params: httpParams }));
    } catch(error:any) {
      throw new Error(error.error?.message || 'Error al obtener las incidencias para aprobacion');
    }
  }

  recuperarPlanilla(params: any): Observable<any>{
    const url = `${this.baseUrl}/tareo/recuperarplanilla`;
    try{
      let httpParams = new HttpParams();
      const paramsString = JSON.stringify(params)
      httpParams = httpParams.set('parametros', paramsString);
      return this.http.get<any>(url, { params: httpParams });
    }catch(error:any){
      throw new Error(error.error?.message || 'Error al obtener los roles');
    }
  }

  recuperarPlanillaSupervisor(params: any): Observable<any>{
    const url = `${this.baseUrl}/tareo/recuperarplanillasupervisor`;
    try{
      let httpParams = new HttpParams();
      const paramsString = JSON.stringify(params)
      httpParams = httpParams.set('parametros', paramsString);
      return this.http.get<any>(url, { params: httpParams });
    }catch(error:any){
      throw new Error(error.error?.message || 'Error al obtener los roles');
    }
  }

  async recuperarTareoSupervisor(params: any): Promise<any> {
    const url = `${this.baseUrl}/tareo/gestionsupervisor`;
    try {
      let httpParams = new HttpParams();
      const paramsString = JSON.stringify(params)
      httpParams = httpParams.set('parametros', paramsString);
      return await lastValueFrom(this.http.get<any>(url, { params: httpParams }));
    } catch(error:any) {
      throw new Error(error.error?.message || 'Error al obtener el reporte');
    }
  }

}
