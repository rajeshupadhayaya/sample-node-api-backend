import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { sequelize } from "./db";

import initRoutes from "./routes";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);
(async () => {
  await sequelize.sync({ force: false });

  try {
    app.listen(PORT, "127.0.0.1", () => {
      console.log(`App listening on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.log(`Error occurred: ${error.message}`);
  }
})();
export default app;
