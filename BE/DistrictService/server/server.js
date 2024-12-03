import express from "express";
import { readFileSync, existsSync } from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터 로드 함수
function loadData() {
  const __dirname = path.resolve();
  const filePath = path.join(
    __dirname,
    "../district-data/행정동-경계-districts-data.json"
  );

  try {
    if (!existsSync(filePath)) {
      throw new Error(`파일이 존재하지 않습니다: ${filePath}`);
    }
    const fileContent = readFileSync(filePath, "utf-8");
    const fileData = JSON.parse(fileContent);
    const districtsData = fileData.map((districtData) => ({
      id: districtData.district_id,
      name: districtData.district_korean_name,
    }));

    const districtsNeighborsData = fileData.reduce((acc, districtData) => {
      acc[districtData.district_id] = {
        levels: districtData.levels,
      };
      return acc;
    }, {});

    return { districtsData, districtsNeighborsData };
  } catch (error) {
    console.error("데이터 로드 실패:", error.message);
    process.exit(1);
  }
}

const { districtsData, districtsNeighborsData } = loadData();

function getDistrictHandler(req, res) {
  try {
    res.status(200).json({ districts: districtsData });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

function getDistrictNeighborsHandler(req, res) {
  try {
    const districtId = req.params.id;
    const targetDistrictNeighbor = districtsNeighborsData[districtId];
    if (!targetDistrictNeighbor) return res.status(404).send();
    res.status(200).json(targetDistrictNeighbor);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

// 서버 초기화 함수
function startServer() {
  app.get("/district/:id/neighbors", getDistrictNeighborsHandler);
  app.get("/district", getDistrictHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// 서버 시작
startServer();
