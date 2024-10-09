export const sql = `
ALTER TABLE chat ADD COLUMN lastBotInteraction INTEGER DEFAULT 0;
`;
