export const sql = `
ALTER TABLE member ADD COLUMN botSilenced INTEGER default 0;
`;
