import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ReporteService {

  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  async reporteSemanal(body: any): Promise<any> {
    const url = `${this.baseUrl}/api/calidad/reporte-semanal`;
    try {
      return await lastValueFrom(this.http.post<any>(url, body));
    } catch(error: any) {
      throw new Error(error.error?.message || 'Error al obtener reporte semanal');
    }
  }
}
