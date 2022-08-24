import * as fs from "fs";
import { all } from "./index.js";

const emojis = await all();
const writer = fs.createWriteStream("/home/dani/emojis.txt");
emojis.forEach(emoji => writer.write(`${emoji}\n`));
writer.close();
