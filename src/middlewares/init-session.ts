import { Context } from "telegraf";

import { Carburanti } from "../interfaces/carburanti.models";

export const initSession = async <T extends Context & { session?: any }>(
  ctx: T,
  next: Function
) => {
  if (!ctx.session.carburanti) {
    ctx.session.carburanti = [Carburanti.Benzina];
  }

  return next();
};
