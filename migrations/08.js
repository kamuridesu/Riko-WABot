export const sql = `
ALTER TABLE chat ADD COLUMN modelPrompt TEXT DEFAULT '';
ALTER TABLE chat ADD COLUMN aiModel TEXT DEFAULT 'llama3.1';
`;
