import EventEmitter from "events";
import { Telegraf } from "telegraf";
import { CheckboxMenu, MenuContextUpdate, RadioMenu } from "telegraf-menu";

import { CARBURANTE_MENU_FILTERS } from "../const/carburanti.filters";
import { Carburanti } from "../interfaces/carburanti.models";
import { CurrentCtx } from "../interfaces/context.models";
import { MenuAction } from "../interfaces/menu.models";

export const submitMenuEvent = new EventEmitter();

export const initCarburantiMenu = (ctx: CurrentCtx) => {
  return new RadioMenu<CurrentCtx, Carburanti>({
    action: MenuAction.IMPOSTA_CARBURANTE,
    message: "Imposta preferenza carburanti",
    submitMessage: "Conferma",
    filters: CARBURANTE_MENU_FILTERS,
    state: ctx.session.carburanti,
    debug: false,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
  });
};
