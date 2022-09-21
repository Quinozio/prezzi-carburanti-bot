import { SceneContext } from "telegraf/typings/scenes";

export const startCommand = (ctx: SceneContext) => {
  ctx.scene.enter("configCarburanti");
};
