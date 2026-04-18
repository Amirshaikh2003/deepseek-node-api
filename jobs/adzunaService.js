const axios = require("axios");
const { DOMAINS } = require("./config");

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

async function fetchJobs(city, page = 1) {
  let allJobs = [];

  for (const domain of DOMAINS) {
    const res = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/${page}`,
      {
        params: {
          app_id: APP_ID,
          app_key: APP_KEY,
          results_per_page: 20,   // 🔥 reduce per domain
          what: domain,           // 🔥 single keyword
          where: city,
          max_days_old: 7
        }
      }
    );

    const jobs = res.data.results || [];
    console.log(`📍 ${city} - ${domain}: ${jobs.length}`);

    allJobs.push(...jobs);
  }

  return allJobs;
}

module.exports = { fetchJobs };
