import path from "path"
import { app } from "electron";

export const TOKEN_FOLDER = path.join(app.getPath("appData"), 'appdatasync/credentials');