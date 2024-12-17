import * as fs from "fs";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

function generateUniquePhoneNumbers(count) {
  const phoneNumbers = new Set();
  while (phoneNumbers.size < count) {
    const randomNumber = `010${Math.floor(
      10000000 + Math.random() * 90000000
    )}`;
    phoneNumbers.add(randomNumber);
  }
  return Array.from(phoneNumbers);
}

function formatToMySQLDatetime(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function generateDummyUser(filePath = "../dummy-users.json") {
  const saltRounds = 1;
  const userCount = 1000;
  const phoneNumbers = generateUniquePhoneNumbers(userCount);
  const users = [];

  for (let i = 0; i < userCount; i++) {
    const user = {
      id: uuidv4(),
      user_id: `user${i + 1}`,
      password: await bcrypt.hash(`password${i + 1}`, saltRounds),
      nickname: `닉네임${i + 1}`,
      phone_number: phoneNumbers[i],
      created_at: formatToMySQLDatetime(new Date()),
    };
    users.push(user);
  }

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
  console.log(`Dummy JSON file generated: ${filePath}`);
}

generateDummyUser();
