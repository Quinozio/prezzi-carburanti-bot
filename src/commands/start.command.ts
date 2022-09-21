import { CurrentCtx } from "../interfaces/context.models";

export const startCommand = (ctx: CurrentCtx) => {
  ctx.session.carburanti = undefined;
  ctx.session.posizione = undefined;
  ctx.scene.enter("configCarburanti");
};
