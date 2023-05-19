export const sql = `
ALTER TABLE member ADD COLUMN groupSilenced INTEGER default 0;
`;
