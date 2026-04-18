const { db, admin } = require("./firebase");
const { fetchJobs } = require("./adzunaService");
const { processJobs } = require("./jobProcessor");
const { CITIES } = require("./config");

async function updateJobs() {
  console.log("🚀 Job update started...");

  for (const city of CITIES) {
    let allJobs = [];

    for (let page = 1; page <= 2; page++) {
      const jobs = await fetchJobs(city, page);
      allJobs.push(...jobs);
    }

    const cleanJobs = processJobs(allJobs);

    await db.collection("jobs").doc(city).set({
      city,
      count: cleanJobs.length,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      jobs: cleanJobs
    });

    console.log(`✅ ${city} updated (${cleanJobs.length} jobs)`);
  }

  console.log("🎉 All cities updated");
}

// 🔥 MAIN EXECUTION (important)
async function run() {
  await updateJobs();

  console.log("✅ Job Runner Finished");

  process.exit(0); // 🔥 VERY IMPORTANT (GitHub ke liye)
}

run();
