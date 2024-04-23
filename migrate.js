import path from "path";
import fs from "fs";
import { open, Database as DB} from "sqlite";
import pkg from 'sqlite3';
const { Database: DBDriver } = pkg

const MIGRATIONS_FOLDER = "migrations";

const files = fs.readdirSync(MIGRATIONS_FOLDER)
                .map(x => path.join(path.join(process.cwd(), MIGRATIONS_FOLDER), x));

const importedModules = files.map(async x => await import(x));

const data = [];
for (let m of importedModules) {
    const d = (await m).sql;
    data.push(d + ";");
}

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

for (let query of data) {
    await db.run(query);
}
