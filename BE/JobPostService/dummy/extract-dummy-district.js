import fs from "fs/promises";

async function trimLargeJsonUniform(
  inputFilePath,
  outputFilePath,
  limit = 1000
) {
  try {
    const data = await fs.readFile(inputFilePath, "utf8");
    const parsedData = JSON.parse(data);

    const totalItems = parsedData.length;
    if (totalItems <= limit) {
      console.log(
        `Data already has ${totalItems} items, no trimming required.`
      );
      await fs.writeFile(
        outputFilePath,
        JSON.stringify(parsedData, null, 2),
        "utf8"
      );
      return;
    }

    const stride = Math.floor(totalItems / limit);

    const trimmedData = [];
    for (let i = 0; i < totalItems; i += stride) {
      if (trimmedData.length < limit) {
        trimmedData.push(parsedData[i]);
      }
    }

    // 결과를 새로운 JSON 파일에 쓰기
    await fs.writeFile(
      outputFilePath,
      JSON.stringify(trimmedData, null, 2),
      "utf8"
    );
    console.log(
      `Successfully trimmed uniformly to ${limit} items and saved to ${outputFilePath}`
    );
  } catch (error) {
    console.error("Error processing JSON file:", error);
  }
}

trimLargeJsonUniform("./districts-data.json", "./dummy-districts-data.json", 1000);
