import dotenv from "dotenv";
import fastify from "fastify";
import { Scenes, Telegraf } from "telegraf";
import { GenericMenu } from "telegraf-menu";
import LocalSession from "telegraf-session-local";

import { economiciCommand } from "./commands/economici.commands";
import { helpCommand } from "./commands/help.commands";
import {
  impostaCarburantiCommand,
  impostaPosizioneCommand,
} from "./commands/settings.commands";
import { startCommand } from "./commands/start.command";
import { commands, CommandsEnum } from "./interfaces/commands.models";
import { CurrentCtx } from "./interfaces/context.models";
import { MenuAction } from "./interfaces/menu.models";
import { initSession } from "./middlewares/init-session";
import {
  configCarburantiScene,
  configPosizioneScene,
} from "./wizards/start.scene";

dotenv.config();

const app = fastify();
const bot = new Telegraf<CurrentCtx>(process.env.BOT_TOKEN ?? "");
const session = new LocalSession({
  database: process.env.DB_FOLDER + "local.db.json",
});
bot.use(session.middleware());
bot.use(initSession);

bot.use(GenericMenu.middleware());

const stage = new Scenes.Stage<Scenes.SceneContext>(
  [configCarburantiScene as any, configPosizioneScene],
  {
    ttl: 10,
  }
);
bot.use(stage.middleware() as any);

bot.command("quit", (ctx) => {
  // Explicit usage
  //   ctx.telegram.leaveChat(ctx.message.chat.id);
  //   // Using context shortcut
  //   ctx.leaveChat();
});
bot.telegram.setMyCommands(commands);

bot.action(
  new RegExp(MenuAction.IMPOSTA_CARBURANTE),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    impostaCarburantiCommand as any
  )
);

bot.command(CommandsEnum.START, startCommand as any);
bot.command(CommandsEnum.HELP, helpCommand as any);
bot.command(CommandsEnum.GET_DISTRIBUTORI_ECONOMICI, economiciCommand as any);
bot.command(CommandsEnum.IMPOSTA_CARBURANTE, impostaCarburantiCommand as any);
bot.command(CommandsEnum.IMPOSTA_POSIZIONE, impostaPosizioneCommand as any);

// bot.on("text", (ctx) => {
//   // Explicit usage
//   // Using context shortcut
//   ctx.reply(`Ciao ${ctx.from.first_name}`);
// });

if (process.env.NODE_ENV === "production") {
  const port = process.env.PORT ? +process.env.PORT : 3000;
  bot.launch();
  // bot
  //   .launch({
  //     webhook: {
  //       domain: "https://calm-gold-chiton-wear.cyclic.app/",
  //       port,
  //     },
  //   })
  //   .then(() => console.log("Webhook bot listening on port", port));
  // const onStartServer = async () => {
  //   const webhook = await bot.createWebhook({
  //     domain: "https://calm-gold-chiton-wear.cyclic.app/",
  //   });
  //   app.post("/" + bot.secretPathComponent(), (req, rep) =>
  //     webhook(req.raw, rep.raw)
  //   );
  //   const port = process.env.PORT ? +process.env.PORT : 3000;
  //   app.listen({ port }).then(() => console.log("Listening on port", port));
  // };
  // onStartServer();
} else {
  bot.launch();
}

// bot.launch({
//   webhook: {
//     domain: os.hostname(),
//     port: process.env.PORT ? +process.env.PORT : 3000,
//   },
// });
console.log("Bot is running!");

process.on("unhandledRejection", (err) => {
  console.log("Caught exception: " + err);
});
process.on("uncaughtException", (err) => {
  console.log("Caught exception: " + err);
});
// const test = async () => {
//   const message = await bot.telegram.sendMessage("452970611", "ou?");
//   bot.telegram.pinChatMessage("452970611", message.message_id);
//   const chat = await bot.telegram.getChat("452970611");

//   console.log(chat);
//   // bot.telegram.deleteMessage(
//   //   452970611,
//   //   (await bot.telegram.getChat("452970611")).pinned_message?.message_id
//   // );
// };
// test();

// bot.use(async (ctx, next) => {
//   console.time(`Processing update ${ctx.update.update_id}`);
//   console.log(ctx.update);
//   await next(); // runs next middleware
//   // runs after next middleware finishes
//   console.timeEnd(`Processing update ${ctx.update.update_id}`);
// });
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
