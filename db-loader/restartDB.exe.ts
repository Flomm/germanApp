import { mainExec } from "./functions/mainExec";
import { EnvType } from "./models/EnvType.enum";

mainExec(["main_hu", "main_de"], true, process.env.NODE_ENV as EnvType);
