const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");

const currentIndex = {};

router.all("/:path{/*splat}", async (req, res) => {
  const path = req.params.path;
  const rest = req.params.splat ? `/${req.params.splat}` : "";

  const registry = JSON.parse(fs.readFileSync("./routes/registry.json"));
  const service = registry.services[path];

  if (!service || service.length === 0) {
    return res.status(404).json({ error: `Service '${path}' not found` });
  }

  if (!service[0].methods.includes(req.method)) {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // round robin load balancing
  if (!currentIndex[path]) {
    currentIndex[path] = 0;
  }

  let instance = service[currentIndex[path]];
  let instTried = 0;

  while (!instance.enabled) {
    currentIndex[path] = (currentIndex[path] + 1) % service.length;
    instance = service[currentIndex[path]];

    instTried++;
    if (instTried === service.length) {
      return res
        .status(503)
        .json({ error: `No enabled instances for service '${path}'` });
    }
  }

  const url = `${instance.url}${rest}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        "Content-Type": req.headers["content-type"],
        Authorization: req.headers["authorization"],
      },
    });
    res.send(response.data);
  } catch {
    res.status(503).json({ error: `Service '${path}' is unavailable` });
  }

  console.log(
    `Routing to instance ${currentIndex[path]} of ${path}: ${instance.url}`,
  );
  currentIndex[path] = (currentIndex[path] + 1) % service.length;
});

module.exports = router;
