const cron = require("node-cron");
const { db, admin } = require("./firebase");
const { fetchJobs } = require("./adzunaService");
const { processJobs } = require("./jobProcessor");
const { CITIES } = require("./config");

async function updateJobs() {
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

    console.log(city, "updated");
  }
}

cron.schedule("0 0 * * *", updateJobs, {
  timezone: "Asia/Kolkata"
});

updateJobs();

console.log("Job Runner Running...");
