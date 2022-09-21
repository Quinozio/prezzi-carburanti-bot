import { BotCommand } from "telegraf/typings/core/types/typegram";

export enum CommandsEnum {
  IMPOSTA_CARBURANTE = "imposta_carburanti",
  IMPOSTA_POSIZIONE = "imposta_posizione",
  GET_DISTRIBUTORI_ECONOMICI = "economici",
  GET_DISTRIBUTORI_VICINI = "vicini",
  START = "start",
  HELP = "help",
  QUIT = "quit",
}
export const commands: BotCommand[] = [
  {
    command: CommandsEnum.START,
    description: "Inizia",
  },
  {
    command: CommandsEnum.GET_DISTRIBUTORI_ECONOMICI,
    description: "Visualizza i distributori più economici",
  },
  // {
  //   command: CommandsEnum.GET_DISTRIBUTORI_VICINI,
  //   description: "Visualizza i distributori più vicini",
  // },
  {
    command: CommandsEnum.IMPOSTA_CARBURANTE,
    description: "Imposta il tipo di carburante",
  },
  {
    command: CommandsEnum.IMPOSTA_POSIZIONE,
    description: "Imposta la posizione",
  },
  {
    command: CommandsEnum.HELP,
    description: "Aiuto",
  },
  {
    command: CommandsEnum.QUIT,
    description: "Esci",
  },
];
