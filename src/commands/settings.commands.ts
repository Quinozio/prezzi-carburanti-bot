import { CurrentCtx } from "../interfaces/context.models";

export const impostaCarburantiCommand = (ctx: CurrentCtx) => {
  ctx.scene.leave();
  ctx.scene.enter("configCarburanti");
};
export const impostaPosizioneCommand = (ctx: CurrentCtx) => {
  ctx.scene.leave();
  ctx.scene.enter("configPosizione");
};
