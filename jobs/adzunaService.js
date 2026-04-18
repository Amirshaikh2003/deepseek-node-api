const axios = require("axios");
const { DOMAINS } = require("./config");

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

function buildQuery() {
  return DOMAINS.join(" OR ");
}

async function fetchJobs(city, page = 1) {
  const res = await axios.get(
    `https://api.adzuna.com/v1/api/jobs/in/search/${page}`,
    {
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        results_per_page: 50,
        what: buildQuery(),
        where: city
      }
    }
  );

  return res.data.results;
}

module.exports = { fetchJobs };
