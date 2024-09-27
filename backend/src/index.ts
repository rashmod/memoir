import express from "express";
import cors from "cors";

import env from "@/config/env";
import router from "@/history/route";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "*" }));

app.use("/api", router);

app.listen(env.PORT, () => {
  console.log(
    `Server started in ${env.NODE_ENV} mode on host ${env.HOST} and port ${env.PORT}`,
  );
});
