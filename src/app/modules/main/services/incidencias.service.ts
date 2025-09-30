import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IncidenciasService {

  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllIncidencias(ruc: string): Observable<any> {
    const url = `${this.baseUrl}/tareoincidencia/all/${ruc}`;
    try {
      return this.http.get<any>(url);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al obtener las multiples incidencias');
    }
  }

  getIncidenciaById(id: number): Observable<any> {
    const url = `${this.baseUrl}/tareoincidencia/byid/${id}`;
    try {
      return this.http.get<any>(url);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al obtener la incidencia');
    }
  }

  postIncidencia(body: any): Observable<any> {
    const url = `${this.baseUrl}/tareoincidencia`;
    try {
      return this.http.post<any>(url, body);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al enviar la incidencia');
    }
  }

  deleteIncidenciaById(id: number): Observable<any> {
    const url = `${this.baseUrl}/tareoincidencia/${id}`;
    try {
      return this.http.delete<any>(url);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al eliminar la incidencia');
    }
  }

  getAllRoles(params: any): Observable<any>{
    const url = `${this.baseUrl}/tareo/rolesdocumentos`;
    try{
      let httpParams = new HttpParams();
      const paramsString = JSON.stringify(params)
      httpParams = httpParams.set('parametros', paramsString);
      return this.http.get<any>(url, { params: httpParams });
    }catch(error:any){
      throw new Error(error.error?.message || 'Error al obtener los roles');
    }
  }

  getAllTipoAprobacion(ruc: any): Observable<any> {
    const url = `${this.baseUrl}/tareo/tipoaprobacion/${ruc}`;
    try {
      return this.http.get<any>(url);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al obtener la incidencia');
    }
  }

  getAllPersonasFlujo(ruc: any): Observable<any> {
    const url = `${this.baseUrl}/rolusuario/all/${ruc}`;
    try {
      return this.http.get<any>(url);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al obtener la incidencia');
    }
  }

  postPersonaRol(body: any): Observable<any> {
    const url = `${this.baseUrl}/rolusuario`;
    try {
      return this.http.post<any>(url, body);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al enviar la incidencia');
    }
  }

  deletePersonaRol(id: any): Observable<any> {
    const url = `${this.baseUrl}/rolusuario/${id}`;
    try {
      return this.http.delete<any>(url);
    } catch (error: any) {
      throw new Error(error.error?.message || 'Error al enviar la incidencia');
    }
  }

}
