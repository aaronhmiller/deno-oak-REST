import { Application, Router, Client } from "./deps.ts";

const client = new Client({
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_NAME"),
  hostname: Deno.env.get("DB_HOST"),
  port: Number(Deno.env.get("DB_PORT")),
});

await client.connect();

const router = new Router();

// GET all items
router.get("/items", async (ctx) => {
  const result = await client.queryArray("SELECT * FROM items");
  ctx.response.body = result.rows;
});

// GET item by id
router.get("/items/:id", async (ctx) => {
  const id = ctx.params.id;
  const result = await client.queryArray("SELECT * FROM items WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Item not found" };
  } else {
    ctx.response.body = result.rows[0];
  }
});

// POST new item
router.post("/items", async (ctx) => {
  const { name, description } = await ctx.request.body().value;
  const result = await client.queryArray(
    "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING id",
    [name, description]
  );
  ctx.response.status = 201;
  ctx.response.body = { id: result.rows[0][0] };
});

// PUT (update) item
router.put("/items/:id", async (ctx) => {
  const id = ctx.params.id;
  const { name, description } = await ctx.request.body().value;
  
  // First, check if the item exists
  const checkResult = await client.queryArray("SELECT * FROM items WHERE id = $1", [id]);
  if (checkResult.rows.length === 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Item not found" };
    return;
  }

  // If the item exists, update it
  const result = await client.queryArray(
    "UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [name, description, id]
  );
  
  ctx.response.body = {
    message: "Item updated successfully",
    item: result.rows[0]
  };
});

// DELETE item
router.delete("/items/:id", async (ctx) => {
  const id = ctx.params.id;
  
  // First, check if the item exists
  const checkResult = await client.queryArray("SELECT * FROM items WHERE id = $1", [id]);
  if (checkResult.rows.length === 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Item not found" };
    return;
  }

  // If the item exists, delete it
  await client.queryArray("DELETE FROM items WHERE id = $1", [id]);
  
  ctx.response.status = 200;
  ctx.response.body = {
    message: "Item deleted successfully"
  };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://0.0.0.0:8000");
await app.listen({ port: 8000, hostname: "0.0.0.0" });
