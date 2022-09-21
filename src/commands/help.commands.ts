import { CurrentCtx } from "../interfaces/context.models";

export const helpCommand = async (ctx: CurrentCtx) => {
  const commands = await ctx.telegram.getMyCommands();
  const info = commands.reduce(
    (acc, val) => `${acc}/${val.command} - ${val.description}\n`,
    ""
  );
  return ctx.reply(info);
};
