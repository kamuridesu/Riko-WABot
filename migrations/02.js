export const sql = `CREATE TABLE IF NOT EXISTS filter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern TEXT,
    kind TEXT,
    response TEXT,
    jid TEXT,
    FOREIGN KEY(jid) REFERENCES chat(jid)
);`