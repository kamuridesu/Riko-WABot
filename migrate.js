import path from "path";
import fs from "fs";
import { open } from "sqlite";
import pkg from 'sqlite3';
const { Database: DBDriver } = pkg

console.log("Starting migrations...");

const MIGRATIONS_FOLDER = "migrations";

const files = fs.readdirSync(MIGRATIONS_FOLDER)
                .map(x => path.join(path.join(process.cwd(), MIGRATIONS_FOLDER), x));

const importedModules = files.sort((a, b) => a - b).map(x => import(x));

const folder = "states";

if (!fs.existsSync(folder)) {
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
        await db.run((await query).sql);
    } catch (e) {
        console.log("Error running migration: " + e);
    }
}

console.log("Finished migrations");
