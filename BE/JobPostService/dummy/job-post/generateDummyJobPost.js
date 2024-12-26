import fs from "fs/promises";

function getRandomJobDescriptions() {
  const jobCategories = [
    "SERVING",
    "KITCHEN_ASSISTANT",
    "CHEF",
    "STORE_MANAGEMENT",
    "BEVERAGE_MAKING",
    "BAKING",
    "CLEANING",
    "ERRANDS",
    "FLYER_DISTRIBUTION",
    "TUTORING",
    "SCHOOL_PICKUP_HELPER",
    "CHILD_CARE",
    "ELDER_CARE",
    "HOUSEKEEPING",
    "MOVING_ASSISTANCE",
    "PET_CARE",
    "CONVENIENCE_STORE",
    "OTHER",
  ];
  const count = Math.floor(Math.random() * 3) + 1; // 1 ~ 3개
  const selectedJobs = [];
  while (selectedJobs.length < count) {
    const randomJob =
      jobCategories[Math.floor(Math.random() * jobCategories.length)];
    if (!selectedJobs.includes(randomJob)) {
      selectedJobs.push(randomJob);
    }
  }
  return selectedJobs;
}
function getRandomDates(count) {
  const dates = [];
  for (let i = 0; i < count; i++) {
    const randomDate = new Date(
      Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 30 // 30일 이내
    );
    dates.push(randomDate.toISOString().split("T")[0]); // YYYY-MM-DD 형식
  }
  return dates;
}

function getRandomDays(count) {
  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const selectedDays = [];
  for (let i = 0; i < count; i++) {
    selectedDays.push(
      daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)]
    );
  }
  return selectedDays;
}

function getRandomTime() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.random() > 0.5 ? "00" : "30";
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

function getRandomSalary() {
  const salaryTypes = ["HOURLY", "PER_TASK", "MONTHLY"];
  const salaryType =
    salaryTypes[Math.floor(Math.random() * salaryTypes.length)];
  const salaryAmount =
    salaryType === "MONTHLY"
      ? Math.floor(Math.random() * 9000000) + 1000000 // 1,000,000 ~ 10,000,000
      : Math.floor(Math.random() * 50000) + 10000; // 10,000 ~ 60,000
  return { salaryType, salaryAmount };
}

function getRandomDistrict(districts) {
  const randomDistrict =
    districts[Math.floor(Math.random() * districts.length)];
  return {
    addressName: randomDistrict.district_korean_name,
    neighborhoodId: randomDistrict.district_id,
  };
}

function getRandomPhotos(photos, count) {
  const selectedPhotos = [];
  for (let i = 0; i < count; i++) {
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    selectedPhotos.push(randomPhoto.imageUrl);
  }
  return selectedPhotos;
}

function getRandomUserId(userData) {
  const randomUser = userData[Math.floor(Math.random() * userData.length)];
  return randomUser.id;
}

function getRandomPastDate(daysAgo = 365) {
  const now = Date.now();
  const pastTime =
    now - Math.floor(Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  return new Date(pastTime);
}

async function getDummyData(targetPath = "../dummy-job-posts.json") {
  try {
    const districtData = JSON.parse(
      await fs.readFile("../dummy-districts-data.json", "utf8")
    );
    const photoData = JSON.parse(
      await fs.readFile("../dummy-photo.json", "utf8")
    );
    const userData = JSON.parse(
      await fs.readFile("../dummy-users.json", "utf8")
    );
    const srcData = await fs.readFile("../src.json", "utf8"); // 파일 읽기
    const srcArray = JSON.parse(srcData); // JSON 문자열을 객체로 변환
    let dummyArray = srcArray.map((src) => ({
      title: src.title,
      detailedDescription: src.detailedDescription,
    }));
    dummyArray = Array(100)
      .fill(dummyArray)
      .flat()
      .map((dummy) => ({ ...dummy }));

    dummyArray.forEach((dummy) => {
      dummy.userId = getRandomUserId(userData);
      dummy.jobDescription = getRandomJobDescriptions();
      dummy.workPeriod = {
        type: Math.random() > 0.5 ? "SHORT_TERM" : "LONG_TERM",
      };
      dummy.workPeriod.type === "SHORT_TERM"
        ? (dummy.workPeriod.dates = getRandomDates(3))
        : (dummy.workPeriod.days = getRandomDays(3));
      dummy.workTime = {
        type: Math.random() > 0.5 ? "FLEXIBLE" : "FIXED",
      };
      if (dummy.workTime.type === "FIXED") {
        let start = getRandomTime();
        let end = getRandomTime();
        dummy.workTime.startTime = start;
        dummy.workTime.endTime = end;
      }
      dummy.salary = dummy.salary = getRandomSalary();
      dummy.photos = getRandomPhotos(photoData, 3);
      const randomDistrict = getRandomDistrict(districtData);
      dummy.addressName = randomDistrict.addressName;
      dummy.neighborhoodId = randomDistrict.neighborhoodId;
      dummy.createdAt = getRandomPastDate();
      dummy.views = Math.floor(Math.random() * 10000);
      dummy.status = Math.random() > 0.5 ? "OPEN" : "CLOSE";
    });
    await fs.writeFile(
      `${targetPath}`,
      JSON.stringify(dummyArray, null, 2),
      "utf8"
    );
    console.log("Data successfully saved to dummy-job-posts.json");
  } catch (err) {
    console.error("Error:", err);
  }
}

getDummyData();
