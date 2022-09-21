import { CurrentCtx } from "../interfaces/context.models";

export const startCommand = async (ctx: CurrentCtx) => {
  ctx.session.carburanti = undefined;
  ctx.session.posizione = undefined;
  await ctx.scene.leave();
  return await ctx.scene.enter("configCarburanti");
};
