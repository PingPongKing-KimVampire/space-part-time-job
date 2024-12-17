import * as fs from "fs/promises";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

// MongoDB 연결 설정
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const collectionName = process.env.MONGODB_COLLECTION;

async function insertJobPosts(filePath = "../dummy-job-posts.json") {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const rawData = await fs.readFile(filePath, "utf8");
    const jobPosts = JSON.parse(rawData);

    const result = await collection.insertMany(jobPosts);
    console.log(`${result.insertedCount} job posts inserted into MongoDB`);

    const updateResult = await collection.updateMany(
      { createdAt: { $type: "string" } },
      [{ $set: { createdAt: { $toDate: "$createdAt" } } }]
    );
    console.log(
      `${updateResult.modifiedCount} documents updated to convert createdAt to ISODate`
    );
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

insertJobPosts();
