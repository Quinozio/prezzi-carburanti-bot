import { MenuFilters, KeyboardButton } from "telegraf-menu";
import { Carburanti } from "../interfaces/carburanti.models";
import { MenuAction } from "../interfaces/menu.models";

export const CARBURANTE_MENU_FILTERS: MenuFilters<Carburanti> = Object.keys(
  Carburanti
).map((key: string) => {
  return new KeyboardButton(key, Carburanti[key as keyof typeof Carburanti]);
});
