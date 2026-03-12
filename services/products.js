const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const PORT = process.env.PRODUCTS_PORT;
const service = "products";

app.use(express.json());

app.get("/products", (req, res) => {
  res.send("On the products page\n");
});

app.listen(PORT, async () => {
  console.log(`Listening on http://localhost:${PORT}`);

  const loginResponse = await axios.post("http://localhost:3000/login", {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  });

  const token = loginResponse.data.token;

  await axios.post(
    "http://localhost:3000/register",
    {
      name: service,
      url: `http://localhost:${PORT}/${service}`,
      port: PORT,
      health: `http://localhost:${PORT}/health`,
      methods: ["GET"],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log(`${service} registered`);
});

process.on("SIGINT", async () => {
  const loginResponse = await axios.post("http://localhost:3000/login", {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  });

  const token = loginResponse.data.token;

  await axios.post(
    "http://localhost:3000/unregister",
    {
      name: service,
      url: `http://localhost:${PORT}/${service}`,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log(`${service} unregistered`);
  process.exit(0);
});
