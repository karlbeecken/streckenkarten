"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const pg_1 = require("pg");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("view engine", "hbs");
app.set("views", path_1.default.join(__dirname, "views"));
const port = process.env.PORT;
const pool = new pg_1.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT || "5432"),
});
pool.query("SET search_path TO 'public';");
app.get("/", (request, response) => {
    pool.query("SELECT name, umap_map.id, slug, username, share_status FROM umap_map LEFT JOIN auth_user ON owner_id = auth_user.id WHERE share_status = 1 AND name ILIKE '%strecke%'", (err, res) => {
        res.rows[res.rows.findIndex((row) => row.username === "moritz")].username = "moritzschmidt_";
        res.rows[res.rows.findIndex((row) => row.username === "karl")].username =
            "KarlBeecken";
        console.log(err ? err.stack : res.rows); // Hello World!
        response.render("index", {
            subject: "Streckenkarten | bahn.gay",
            name: "bahn",
            entries: res.rows,
            link: "mailto:karl@beecken.berlin",
        });
    });
});
app.listen(port || 3000, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
