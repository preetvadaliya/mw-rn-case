export enum Screens {
  HOME = 'Home',
  LIST_QUOTES = 'LIST Quotes',
  CREATE_QUOTE = 'Create Quote'
}

export const PRODUCT_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY NOT NULL, title TEXT, price REAL NOT NULL);
`;
