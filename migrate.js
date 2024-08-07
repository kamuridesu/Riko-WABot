import fs from "fs";
import path from "path";
import { open } from "sqlite";
import pkg from 'sqlite3';
const { Database: DBDriver } = pkg

console.log("Starting migrations...");

const MIGRATIONS_FOLDER = "migrations";

const files = fs.readdirSync(MIGRATIONS_FOLDER)
                .map(x => path.join(path.join(process.cwd(), MIGRATIONS_FOLDER), x));

const importedModules = files.sort((a, b) => a - b).map(x => import(x));

const folder = process.env.DEBUG != undefined ? "" : "states";

if (folder != "" && !fs.existsSync(folder)) {
    try {
        fs.mkdirSync(folder);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

const db = await open({
    filename: path.join(folder, "database.sqlite"),
    driver: DBDriver
});


for (let query of importedModules) {
    try {
        await db.exec((await query).sql);
    } catch (e) {
        if (!e.toString().includes("duplicate column name")) {
            console.log("Error running migration: " + e);
        }
    }
}

console.log("Finished migrations");
