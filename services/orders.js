const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const PORT = process.env.ORDERS_PORT;
const service = "orders";

app.use(express.json());

app.get("/orders", (req, res) => {
  res.json({ message: "Orders list" });
});

app.post("/orders", (req, res) => {
  res.status(201).json({ message: "Order created", data: req.body });
});

app.get("/orders/:id", (req, res) => {
  res.json({ message: `Order ${req.params.id}` });
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
      methods: ["GET", "POST"],
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
