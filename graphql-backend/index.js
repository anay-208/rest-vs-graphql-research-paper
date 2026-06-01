import { buildSchema } from "graphql";
import { readFileSync } from "node:fs";
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import rootValue from "./resolvers/index.js";

const schema = buildSchema(
  readFileSync(new URL("./schema.graphql", import.meta.url), "utf8"),
);

const app = express();

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue,
  }),
);

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
