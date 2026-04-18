function processJobs(jobs) {
  const map = new Map();

  jobs.forEach(job => {
    // ❗ skip invalid jobs
    if (!job.id || !job.title) return;

    map.set(job.id, {
      id: job.id,

      // 🔹 Core fields (important only)
      title: job.title,
      company: job.company?.display_name || "N/A",
      location: job.location?.display_name || "",

      // 🔹 Salary (optional but useful)
      salary_min: job.salary_min || null,
      salary_max: job.salary_max || null,

      // 🔹 Apply link (must-have)
      url: job.redirect_url,

      // 🔹 Created date (sorting / freshness)
      created: job.created
    });
  });

  return Array.from(map.values());
}

module.exports = { processJobs };
