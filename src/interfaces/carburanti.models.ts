import { IPosition } from "./context.models";

export enum Carburanti {
  Benzina = "1-x",
  Gasolio = "2-x",
  Metano = "3-x",
  GPL = "4-x",
}

export interface Fuel {
  id: number;
  price: number;
  name: string;
  fuelId: number;
  isSelf: boolean;
}

export interface IDistributore {
  id: number;
  name: string;
  carburanti: string;
  fuels: Fuel[];
  location: { lat: string; lng: string };
  insertDate: Date;
  address: string;
  brand: string;
}

export interface IDistributoriResponse {
  success: boolean;
  center?: any;
  results: IDistributore[];
}
