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
    msgCount: number | null;
    botSilenced: boolean;
    groupSilenced: boolean;   
}

export class Database {
    db: DB | undefined;
    dbFile = path.join("states", "database.sqlite");

    constructor() {
        this.connect().then(() => console.log("DB OK"));
    }

    async connect() {
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

    async getChat(chatJid: string): Promise<String | null> {
        const query = `SELECT * FROM chat WHERE jid = ?`;
        await this.connect();
        const result = await this.db?.get(query, [chatJid]);
        if (result) return result;
        return null;
    }

    async addChatIfNotExists(chatjid: string) {
        if ((await this.getChat(chatjid)) == null) {
            await this.addChat(chatjid);
        }
    }

    async getMember(chatJid: string, userJid: string) {
        const query = `SELECT * FROM member WHERE jid = ? AND chatId = ?`;
        await this.connect();
        const result: Member | undefined = await this.db?.get(query, [userJid, chatJid]);
        return result ? result : null;
    }

    async createMember(chatJid: string, userJid: string) {
        await this.addChatIfNotExists(chatJid);
        const query = `INSERT INTO member (jid, chatId, points, msgCount) VALUES (?, ?, ?, ?)`;
        await this.connect();
        await this.db?.run(query, [userJid, chatJid, 0, 0]);
    }

    async getAllMembers(chatJid: string) {
        const query = `SELECT * FROM member WHERE chatId = ?`;
        await this.connect();
        const result: Member[] | undefined = await this.db?.all(query, [chatJid]);
        return result ? result : [];
    }

    async addToMessageCount(chatJid: string, userJid: string, reset = false) {
        const member = await this.getMember(chatJid, userJid);
        let totalMessages = 1;
        if (!member) {
            await this.createMember(chatJid, userJid);
        } else {
            totalMessages += member.msgCount ? member.msgCount : 0;
        }
        if (reset) {
            totalMessages = 0;
        }
        await this.updateMessageCounter(totalMessages, userJid, chatJid);
    }

    private async updateMessageCounter(totalMessages: number, userJid: string, chatJid: string) {
        const query = `UPDATE member SET msgCount=? WHERE jid = ? AND chatId = ?`;
        await this.connect();
        await this.db?.run(query, [totalMessages, userJid, chatJid]);
    }

    async silenceUserFromBot(userJid: string, chatJid: string, silence = true) {
        const member = await this.getMember(chatJid, userJid);
        if (!member) {
            await this.createMember(chatJid, userJid);
        }
        await this.connect();
        const query = `UPDATE member SET botSilenced=? WHERE jid = ? AND chatId = ?`;
        const silenced = silence ? 1 : 0;
        await this.db?.run(query, [silenced, userJid, chatJid]);
    }

    async silenceUserFromChat(userJid: string, chatJid: string, silence = true) {
        const member = await this.getMember(chatJid, userJid);
        if (!member) {
            await this.createMember(chatJid, userJid);
        }
        await this.connect();
        const query = `UPDATE member SET groupSilenced=? WHERE jid = ? AND chatId = ?`;
        const silenced = silence ? 1 : 0;
        await this.db?.run(query, [silenced, userJid, chatJid]);
    }
}


export class PointsDB extends Database {
    constructor() {
        super();
    }

    async updateMemberPoints(chatJid: string, userJid: string, points: number) {
        const query = `UPDATE member SET points=? WHERE chatId = ? AND jid = ?`;
        await this.connect();
        await this.db?.run(query, [points, chatJid, userJid]);
    }

    async addMemberToPoints(chatJid: string, userJid: string, points: number, subtract = false) {
        const member = await this.getMember(chatJid, userJid);
        let newPoints = 0;
        if (!member) {
            await this.createMember(chatJid, userJid);
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
}


export class FilterDB extends Database {
    constructor() {
        super();
    }

    async addFilterIfNotExists(chatJid: string, kind: string, response: string, pattern: string) {
        if ((await this.getFilters(chatJid)).filter((x) => x.pattern == pattern).length < 1) {
            await this.addFilter(pattern, kind, chatJid, response);
        }
    }

    async deleteFilter(filter: string, chatJid: string) {
        const query = `DELETE FROM filter WHERE pattern = ? AND jid = ?;`;
        await this.connect();
        await this.db?.run(query, [filter, chatJid]);
    }

    async getFilters(chatJid: string): Promise<Filter[]> {
        const query = `SELECT * FROM filter WHERE jid = ?`;
        await this.connect();
        const result = await this.db?.all(query, [chatJid]);
        if (result) return result;
        return [];
    }

    async addFilter(filter: string, kind: string, chatJid: string, response: string) {
        const query = `INSERT INTO filter (pattern, jid, kind, response) VALUES (?, ?, ?, ?);`;
        await this.connect();
        await this.db?.run(query, [filter, chatJid, kind, response]);
    }

}