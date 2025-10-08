import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CalidadService {

  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getNotasCampo(body: any): Observable<any> {
    const url = `${this.baseUrl}/api/calidad/listar-notas`;
    try {
      return this.http.post<any>(url, body);
    } catch(error: any) {
      throw new Error(error.error?.message || 'Error al obtener notas');
    }
  }

  registrarNota(body: any): Observable<any> {
    const url = `${this.baseUrl}/api/calidad/registrar-nota`;
    try {
      return this.http.post<any>(url, body);
    } catch(error: any) {
      throw new Error(error.error?.message || 'Error al registrar notas');
    }
  }

}
