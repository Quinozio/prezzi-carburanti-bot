import { CurrentCtx } from "../interfaces/context.models";

export const impostaCarburantiCommand = async (ctx: CurrentCtx) => {
  await ctx.scene.leave();
  await ctx.scene.enter("configCarburanti");
};
export const impostaPosizioneCommand = async (ctx: CurrentCtx) => {
  await ctx.scene.leave();
  await ctx.scene.enter("configPosizione");
};
