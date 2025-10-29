import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fetch from "node-fetch";
import fs from "fs";

const DB_URL = process.env.DB_URL || "https://gfs204n166.userstorage.mega.co.nz/dl/Y8TXa9a_seogKgeTZeRcANdDE660KWwg881bSqhZLmoSBXc6kgdexpR1rezpYKdhJBqFTHl3xUHnq-qP1jSzSHAz4csQK2L22hFV57oZw40MJafacBT98GizDjewC0quVwy0IZl7USb_kxexwUyV_5fanTQbdw/numbers.db";
const DB_PATH = "/tmp/numbers.db"; // writable temp directory on Vercel

async function getDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    console.log("Downloading database...");
    const res = await fetch(DB_URL);
    if (!res.ok) throw new Error("Failed to download DB");
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(DB_PATH, Buffer.from(buffer));
  }

  return open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });
}

export default async function handler(req, res) {
  try {
    const number = req.query.number;
    if (!number) {
      res.status(400).json({ error: "Please provide ?number=1234567890" });
      return;
    }

    const db = await getDatabase();
    const row = await db.get("SELECT * FROM numbers WHERE mobile = ?", number);
    await db.close();

    if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ message: "Number not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
