import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text: string, params: Array<string>) {
  const res = await client.query(text, params);
  return res;
}

client.connect();
