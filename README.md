# mcp-recipes

Recipes MCP — wraps TheMealDB API (free tier, no auth)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `search_meals` | Search for recipes by meal name. Returns a list of matching meals. |
| `get_meal` | Get the full recipe for a meal by its TheMealDB ID, including ingredients and instructions. |
| `random_meal` | Get a random meal recipe. |
| `meals_by_ingredient` | Find meals that use a specific ingredient (e.g., "chicken", "garlic", "pasta"). |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "recipes": {
      "url": "https://gateway.pipeworx.io/recipes/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use recipes
```

## License

MIT
