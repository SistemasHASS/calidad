export interface Usuario {
    documentoidentidad: string;
    id: string;
    idproyecto: string;
    idrol: string;
    nombre: string;
    proyecto: string;
    razonSocial: string;
    rol: string;
    ruc: string;
    sociedad: number;
    usuario: string;
    idempresa: string;
}
export interface Configuracion {
    id: string;
    idempresa: string;
    idfundo: string;
    idcultivo: string;
}
export interface Empresa {
    id: string;
    idempresa: string;
    ruc: string;
    razonsocial: string;
    empresa: number;
}
export interface Fundo {
    id: number;
    fundo: number;
    empresa: number;
    codigoFundo: string;
    nombreFundo: string
}
export interface Cultivo {
    id: number;
    empresa: number;
    codigo: string;
    descripcion: string;
}
export interface Trabajador {
    id: string
    ruc: string
    nrodocumento: string
    nombres: string
    apellidopaterno: string
    apellidomaterno: string
    estado: number
    motivo: string
    bloqueado: number
    eliminado: number
    idmotivo: number
    motivosalida: number
}
export interface Evaluaciones {
    id: string;
    ruc: string;
    dni: string;
    cosechador: string;
    promedio: number;
    detalle: NotaPersona[];
}
export interface NotaPersona {
    idevaluacion: string;
    ruc: string;
    fecha: string;
    dni: string;
    nota: number;
    evaluador: string;
    idrol: string;
    estado: number;
    nota_aseg: string;
    ev_aseg: string;
    nota_campo: string;
    ev_campo: string;
    sin_reporte: string;
    campo_prom: string;
    nota_acopio: string;
    ev_acopio: string;
    nota_final: string;
}
