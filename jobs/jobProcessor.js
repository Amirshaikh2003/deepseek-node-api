function processJobs(jobs) {
  const map = new Map();

  jobs.forEach(job => {
    map.set(job.id, {
      id: job.id,
      t: job.title,
      c: job.company?.display_name || "N/A",
      l: job.location?.display_name || "",
      s: job.salary_min || null,
      u: job.redirect_url
    });
  });

  return Array.from(map.values());
}

module.exports = { processJobs };
