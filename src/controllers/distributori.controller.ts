import {
  Carburanti,
  IDistributore,
  IDistributoriResponse,
} from "../interfaces/carburanti.models";
import { IPosition } from "../interfaces/context.models";

import fetch from "node-fetch";

export const getDistributoriVicini = async (
  carburante: Carburanti,
  posizione: IPosition
): Promise<IDistributore[]> => {
  const payload = {
    points: [{ lat: posizione.lat, lng: posizione.long }],
    fuelType: carburante,
    priceOrder: "asc",
    radius: 5,
  };
  const response = await fetch(
    `https://carburanti.mise.gov.it/ospzApi/search/zone`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json: IDistributoriResponse = await response.json();
  const distributori = json.results;
  const carburanteId = +carburante.substring(0, 1);
  return distributori.splice(0, 10).map((distributore) => {
    const fuels = distributore.fuels.filter(
      (fuel) => fuel.fuelId === carburanteId
    );
    return {
      ...distributore,
      carburanti: fuels.reduce(
        (acc, val, index) =>
          `${acc}${index === 0 ? "" : ", "} ${val.name}: ${val.price}€ ${
            val.isSelf ? " (Self)" : " (Servito)"
          }`,
        ""
      ),
    };
  });
};
