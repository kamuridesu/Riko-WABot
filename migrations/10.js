export const sql = `
ALTER TABLE chat ADD COLUMN stopped INTEGER DEFAULT 0;
`;
