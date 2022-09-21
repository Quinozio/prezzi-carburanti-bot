import { getDistributoriVicini } from "../controllers/distributori.controller";
import { Carburanti } from "../interfaces/carburanti.models";
import { CommandsEnum } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import haversine from "haversine-distance";

export const economiciCommand = async (ctx: CurrentCtx) => {
  if (!ctx.session.carburanti) {
    ctx.reply("Sembra che tu non abbia impostato i filtri per carburante!");
  } else if (!ctx.session.posizione) {
    ctx.reply(
      `Sembra che tu non abbia impostato la posizione di ricerca!\nUsa il comando /${CommandsEnum.IMPOSTA_POSIZIONE} per impostare la tua posizione`
    );
  } else {
    const distributori = await getDistributoriVicini(
      ctx.session.carburanti,
      ctx.session.posizione
    );

    const links = distributori.map(
      (distributore) =>
        `(https://www.google.com/maps/search/?api=1&query=${distributore.location.lat},${distributore.location.lng})`
    );
    const { lat, long } = ctx.session.posizione;
    const distributoriText = distributori.reduce((acc, val, index) => {
      const { lat: lat2, lng: long2 } = val.location;
      const distanceMeter = haversine(
        {
          latitude: +lat,
          longitude: +long,
        },
        { latitude: +lat2, longitude: +long2 }
      );
      const distanceKm = (distanceMeter / 1000).toFixed(2);
      return `${acc}\n${index + 1}) ${
        val.name
      } (Distanza: \\~${distanceKm}km) | *${val.carburanti}* \n[${
        val.address
      }]$link
      `;
    }, "");
    let distributoriTextEscaped = decodeURI(distributoriText)
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)")
      .replaceAll(".", "\\.")
      .replaceAll("-", "\\-")
      .replaceAll("|", "\\|")
      .replaceAll("+", "\\+");

    links.forEach((link) => {
      distributoriTextEscaped = distributoriTextEscaped.replace("$link", link);
    });

    let carburanteText = "";
    Object.keys(Carburanti).forEach((key) => {
      if (
        Carburanti[key as keyof typeof Carburanti] === ctx.session.carburanti
      ) {
        carburanteText = key;
      }
    });
    await ctx.reply(
      `Ecco a te i distributori di ${carburanteText} più economici vicino a ${ctx.session.posizione.description}:`
    );

    await ctx.replyWithMarkdownV2(distributoriTextEscaped);
  }
};
