import { UserInterface } from "./users";

export interface TrasnsaccionesInterface {
    id?: number;
    id_origen?: number;
    id_destino?: number;
    origen: UserInterface['username'];
    destino: UserInterface;
    cantidad: number;
    fecha_realizada: Date;
}