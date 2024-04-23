// import { Database as DBDriver } from "sqlite3";
import { open, Database as DB } from "sqlite";
import path from "path";
import { existsSync, mkdirSync } from "fs";

import pkg from 'sqlite3';
const { Database: DBDriver } = pkg

export let IS_DB_ENABLED = true;

if (!existsSync("states")) {
    try {
        mkdirSync("states");
    } catch (e) {
        console.error(e);
        IS_DB_ENABLED = false;
    }
}

export interface Filter {
    jid: string;
    pattern: string;
    kind: string;
    response: string;
}

export interface Member {
    jid: string;
    chatId: string;
    points: number;
}

export class Database {
    db: DB | undefined;
    dbFile = path.join("states", "database.sqlite");

    constructor() {
        this.connect().then(() => console.log("DB OK"));
    }

    private async connect() {
        this.db = await open({
            filename: this.dbFile,
            driver: DBDriver
        });
    }

    async addChat(chatJid: string) {
        const query = `INSERT INTO chat (jid) VALUES (?);`;
        await this.connect();
        await this.db?.run(query, [chatJid]);
    }

    async addFilter(filter: string, kind: string, chatJid: string, response: string) {
        const query = `INSERT INTO filter (pattern, jid, kind, response) VALUES (?, ?, ?, ?);`;
        await this.connect();
        await this.db?.run(query, [filter, chatJid, kind, response]);
    }

    async getFilters(chatJid: string): Promise<Filter[]> {
        const query = `SELECT * FROM filter WHERE jid = ?`;
        await this.connect();
        const result = await this.db?.all(query, [chatJid]);
        if (result) return result;
        return [];
    }

    async getChat(chatJid: string): Promise<String | null> {
        const query = `SELECT * FROM chat WHERE jid = ?`;
        await this.connect();
        const result = await this.db?.get(query, [chatJid]);
        if (result) return result;
        return null;
    }

    async deleteFilter(filter: string, chatJid: string) {
        const query = `DELETE FROM filter WHERE pattern = ? AND jid = ?;`;
        await this.connect();
        await this.db?.run(query, [filter, chatJid]);
    }

    async addChatIfNotExists(chatjid: string) {
        if ((await this.getChat(chatjid)) == null) {
            await this.addChat(chatjid);
        }
    }

    async addFilterIfNotExists(chatJid: string, kind: string, response: string, pattern: string) {
        if ((await this.getFilters(chatJid)).filter((x) => x.pattern == pattern).length < 1) {
            await this.addFilter(pattern, kind, chatJid, response);
        }
    }

    async getPointsMember(chatJid: string, userJid: string) {
        const query = `SELECT * FROM member WHERE jid = ? AND chatId = ?`;
        await this.connect();
        const result: Member | undefined = await this.db?.get(query, [userJid, chatJid]);
        return result ? result : null;
    }

    async updateMemberPoints(chatJid: string, userJid: string, points: number) {
        const query = `UPDATE member SET points=? WHERE chatId = ? AND jid = ?`;
        await this.connect();
        await this.db?.run(query, [points, chatJid, userJid]);
    }

    async createMemberPoints(chatJid: string, userJid: string) {
        const query = `INSERT INTO member (jid, chatId, points) VALUES (?, ?, ?)`;
        await this.connect();
        await this.db?.run(query, [userJid, chatJid, 0]);
    }

    async addMemberToPoints(chatJid: string, userJid: string, points: number, subtract = false) {
        const member = await this.getPointsMember(chatJid, userJid);
        let newPoints = 0;
        if (!member) {
            await this.createMemberPoints(chatJid, userJid);
        } else {
            newPoints = member.points;
        }
        if (subtract) {
            newPoints = newPoints - points;
        } else {
            newPoints += points;
        }
        await this.updateMemberPoints(chatJid, userJid, newPoints);
    }

    async getAllMembersPoints(chatJid: string) {
        const query = `SELECT * FROM member WHERE chatId = ?`;
        await this.connect();
        const result: Member[] | undefined = await this.db?.all(query, [chatJid]);
        return result ? result : [];
    }
}
