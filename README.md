# mcp-recipes

Recipes MCP — wraps TheMealDB API (free tier, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_meals` | Search for recipes by meal name. Returns meal IDs, names, and thumbnail images. Use get_meal to fetch full ingredients and cooking instructions. |
| `get_meal` | Get complete recipe details including ingredients with measurements and step-by-step cooking instructions. Pass a meal ID from search_meals or random_meal. |
| `random_meal` | Get a random meal recipe with full ingredients and cooking instructions. Use when you need recipe inspiration without a specific search. |
| `meals_by_ingredient` | Find all recipes using a specific ingredient (e.g., "chicken", "garlic", "pasta"). Returns meal names and IDs to pass to get_meal. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "recipes": {
      "url": "https://gateway.pipeworx.io/recipes/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Recipes data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
