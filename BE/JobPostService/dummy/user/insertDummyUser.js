import * as fs from "fs";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export function insertDataToDB(filePath = "../dummy-users.json") {
  const rawData = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(rawData);

  users.forEach((user) => {
    connection.query(
      "INSERT INTO user (id, user_id, password, nickname, phone_number, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user.id,
        user.user_id,
        user.password,
        user.nickname,
        user.phone_number,
        user.created_at,
      ],
      (err) => {
        if (err) throw err;
        console.log(`Inserted: ${user.user_id}`);
      }
    );
  });

  connection.end();
  console.log("Data insertion completed.");
}

insertDataToDB();
