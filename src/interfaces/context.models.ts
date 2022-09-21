import { Scenes } from "telegraf";
import { DefaultCtx, GenericMenu } from "telegraf-menu";

import { Carburanti } from "./carburanti.models";

export interface IPosition {
  lat: string;
  long: string;
  description: string;
}
export interface ISession {
  posizione?: IPosition;
  carburanti: Carburanti;
  keyboardMenu: GenericMenu;
}
export type CurrentCtx = DefaultCtx & {
  session: ISession;
  scene: Scenes.SceneContextScene<DefaultCtx, Scenes.WizardSessionData>;
  wizard: Scenes.WizardContextWizard<any>;
};
