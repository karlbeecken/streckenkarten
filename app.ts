import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Client, Pool } from "pg";

dotenv.config();

const app: Express = express();
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
const port = process.env.PORT;
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432"),
});

pool.query("SET search_path TO 'public';");

app.get("/", (request: Request, response: Response) => {
  pool.query(
    "SELECT name, umap_map.id, slug, username, share_status FROM umap_map LEFT JOIN auth_user ON owner_id = auth_user.id WHERE share_status = 1 AND name ILIKE '%strecke%'",
    (err, res) => {
      res.rows[
        res.rows.findIndex((row) => row.username === "moritz")
      ].username = "moritzschmidt_";
      res.rows[res.rows.findIndex((row) => row.username === "karl")].username =
        "KarlBeecken";

      console.log(err ? err.stack : res.rows); // Hello World!

      response.render("index", {
        subject: "Streckenkarten | bahn.gay",
        name: "bahn",
        entries: res.rows,
        link: "mailto:karl@beecken.berlin",
      });
    }
  );
});

app.listen(port || 3000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
