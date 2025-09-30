import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { lastValueFrom  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TrabajadoresService {

  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getDatosPersonales(params: any): Observable<any>{
    const url = `${this.baseUrl}/tareo/trabajador`;
    try{
      let httpParams = new HttpParams();
      const paramsString = JSON.stringify(params)
      httpParams = httpParams.set('parametros', paramsString);
      return this.http.get<any>(url, { params: httpParams });
    }catch(error:any){
      throw new Error(error.error?.message || 'Error al obtener trabajador');
    }
  }

  getDatosUsuario(params: any): Observable<any> {
    const url = `${this.baseUrl}/tareo/usuariorol`;
    try{
      let httpParams = new HttpParams();
      const paramsString = JSON.stringify(params)
      httpParams = httpParams.set('parametros', paramsString);
      return this.http.get<any>(url, { params: httpParams });
    }catch(error:any){
      throw new Error(error.error?.message || 'Error al obtener el usuario');
    }
  }

  async getSupervisores(params: any): Promise<any> {
    const url = `${this.baseUrl}/tareo/supervisores`;
    try {
      let httpParams = new HttpParams();
      const paramsString = JSON.stringify(params)
      httpParams = httpParams.set('parametros', paramsString);
      return await lastValueFrom(this.http.get<any>(url, { params: httpParams }));
    } catch(error:any){
      throw new Error(error.error?.message || 'Error al obtener supervisores');
    }
  }

}
