const app = require("./app");
const mongoose = require("mongoose");
const { sequelize } = require("./models/mysql");

async function start() {
  await sequelize.authenticate();
  // In real delivery: use migrations instead of sync in production
  await sequelize.sync();

  await mongoose.connect(process.env.MONGO_URI);

  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => console.log(`API running on :${port}`));
}

start().catch((e) => {
  console.error("Startup failed:", e);
  process.exit(1);
});
