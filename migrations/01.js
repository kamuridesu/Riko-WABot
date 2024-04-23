export const sql = `CREATE TABLE IF NOT EXISTS member (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jid TEXT,
    chatId TEXT,
    points INTEGER,
    FOREIGN KEY(chatId) REFERENCES chat(jid)
);`;
