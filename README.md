# @pipeworx/mcp-recipes

MCP server for meal recipes — search by name, ingredient, or category via TheMealDB.

## Tools

| Tool | Description |
|------|-------------|
| `search_meals` | Search for recipes by meal name |
| `get_meal` | Get the full recipe for a meal by its TheMealDB ID |
| `random_meal` | Get a random meal recipe |
| `meals_by_ingredient` | Find meals that use a specific ingredient |

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

## CLI Usage

```bash
npx pipeworx use recipes
```

## License

MIT
