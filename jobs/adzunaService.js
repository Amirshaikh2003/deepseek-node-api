const axios = require("axios");
const { DOMAINS } = require("./config");

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

// 🔥 Smart query (avoid over-complex OR issues)
function buildQuery() {
  return DOMAINS.join(" ");
}

// 🚀 Fetch jobs
async function fetchJobs(city, page = 1) {
  try {
    const res = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/${page}`,
      {
        params: {
          app_id: APP_ID,
          app_key: APP_KEY,
          results_per_page: 50,
          what: buildQuery(),
          where: city,
          max_days_old: 7,     // 🔥 fresh jobs only
          content_type: "application/json"
        }
      }
    );

    const jobs = res.data.results || [];

    console.log(`📍 ${city} → fetched ${jobs.length} jobs`);

    return jobs;

  } catch (err) {
    console.error(`❌ ${city} fetch error:`, err.message);
    return [];
  }
}

module.exports = { fetchJobs };
