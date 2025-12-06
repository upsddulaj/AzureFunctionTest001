const { app } = require("@azure/functions");
const fs = require("fs").promises;
const path = require("path");

// Serve the static website for any GET route.
app.setup({
  enableHttpStream: true,
});

const indexPath = path.join(__dirname, "..", "index.html");

app.http("website", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "{*path}",
  handler: async (_request, context) => {
    try {
      const html = await fs.readFile(indexPath, "utf8");
      return {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
        body: html,
      };
    } catch (error) {
      context.error("Failed to load index.html", error);
      return { status: 500, body: "Site unavailable" };
    }
  },
});
