import { Markup, Scenes } from "telegraf";
import { CommandsEnum } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initCarburantiMenu } from "../menus/carburanti.menu";
const fetch = require("node-fetch");

// Config carburanti scene
export const configCarburantiScene = new Scenes.BaseScene<CurrentCtx>(
  "configCarburanti"
);
configCarburantiScene.enter(async (ctx) => {
  const text = `Ciao, imposta un tipo di carburante \u{26FD} per poter cercare i distributori più economici vicino a te!`;
  await ctx.replyWithMarkdown(text);
  const menu = initCarburantiMenu(ctx as any);

  if (ctx.message.text) {
    const isCommand = ctx.message.text[0] === "/";
    if (isCommand) {
      ctx.scene.leave();
    }
  }

  menu.genericConfig.onSubmit = (submitCtx, state) => {
    ctx.session.carburanti = state;
    if (!ctx.session.posizione) {
      ctx.scene.enter("configPosizione");
    } else {
      ctx.scene.leave();
    }
  };
  await menu.sendMenu(ctx);
});
configCarburantiScene.leave(async (ctx) => {
  if (ctx.session.carburanti && ctx.session.posizione) {
    return await ctx.reply(
      `Puoi iniziare a cercare i distributori più economici con il comando /${CommandsEnum.GET_DISTRIBUTORI_ECONOMICI}`
    );
  }
});

export const configPosizioneScene = new Scenes.BaseScene<CurrentCtx>(
  "configPosizione"
);
configPosizioneScene.enter(async (ctx) => {
  const text =
    "Scrivi un indirizzo dove vuoi cercare oppure premi il tasto allega e invia la tua posizione corrente \u{1F4CD}";
  await ctx.replyWithMarkdown(text);
});

// configPosizioneScene.on("message", (ctx) => ctx.reply("Try /echo or /greeter"));

configPosizioneScene.on("text", async (ctx) => {
  if (ctx?.message?.text) {
    const isCommand = ctx.message.text[0] === "/";
    if (isCommand) {
      ctx.scene.leave();
    }
    await ctx.reply("...cerco la posizione");
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${ctx.message.text}&format=geocodejson`
    );
    const json = await res.json();
    const coordinates = json.features[0]?.geometry?.coordinates;
    if (!coordinates) {
      configPosizioneScene.enter();
      return await ctx.reply(
        "Nessuna posizione trovata! Si prega di riprovare."
      );
    }
    const lat = coordinates[1];
    const long = coordinates[0];
    const text = `La posizione è corretta?
            https://www.google.com/maps/search/?api=1&query=${lat},${long}`;

    ctx.session.posizione = { description: ctx.message.text, lat, long };
    return await ctx.reply(
      text,
      Markup.inlineKeyboard([
        Markup.button.callback("Si", "Si"),
        Markup.button.callback("No", "No"),
      ])
    );
  }
});

configPosizioneScene.action("Si", async (ctx) => {
  await ctx.reply("Posizione confermata!");
  return ctx.scene.leave();
});
configPosizioneScene.action("No", async (ctx) => {
  ctx.session.posizione = undefined;
  return ctx.scene.enter("configPosizione");
});

configPosizioneScene.leave((ctx) => {
  if (ctx.session.posizione) {
    ctx.reply(
      `Puoi iniziare a cercare i distributori più economici con il comando /${CommandsEnum.GET_DISTRIBUTORI_ECONOMICI}`
    );
  }
});
