/**
 * Recipes MCP — wraps TheMealDB API (free tier, no auth)
 *
 * Tools:
 * - search_meals: search recipes by name
 * - get_meal: full recipe details by meal ID
 * - random_meal: get a random recipe
 * - meals_by_ingredient: find meals that use a specific ingredient
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

type RawMeal = {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  strYoutube?: string;
  strSource?: string;
  strTags?: string;
  [key: string]: string | undefined;
};

type SlimMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb?: string;
};

const tools: McpToolExport['tools'] = [
  {
    name: 'search_meals',
    description: 'Search for recipes by meal name. Returns a list of matching meals.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Meal name or partial name to search for' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_meal',
    description: 'Get the full recipe for a meal by its TheMealDB ID, including ingredients and instructions.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'TheMealDB meal ID (e.g., "52772")' },
      },
      required: ['id'],
    },
  },
  {
    name: 'random_meal',
    description: 'Get a random meal recipe.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'meals_by_ingredient',
    description: 'Find meals that use a specific ingredient (e.g., "chicken", "garlic", "pasta").',
    inputSchema: {
      type: 'object',
      properties: {
        ingredient: { type: 'string', description: 'Ingredient name to filter by' },
      },
      required: ['ingredient'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_meals':
      return searchMeals(args.query as string);
    case 'get_meal':
      return getMeal(args.id as string);
    case 'random_meal':
      return randomMeal();
    case 'meals_by_ingredient':
      return mealsByIngredient(args.ingredient as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function extractIngredients(meal: RawMeal): { ingredient: string; measure: string }[] {
  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();
    if (ingredient) {
      ingredients.push({ ingredient, measure: measure ?? '' });
    }
  }
  return ingredients;
}

function formatFullMeal(meal: RawMeal) {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory ?? null,
    area: meal.strArea ?? null,
    instructions: meal.strInstructions ?? null,
    thumbnail_url: meal.strMealThumb ?? null,
    youtube_url: meal.strYoutube ?? null,
    source_url: meal.strSource ?? null,
    tags: meal.strTags ? meal.strTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    ingredients: extractIngredients(meal),
  };
}

function formatSlimMeal(meal: SlimMeal) {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    thumbnail_url: meal.strMealThumb ?? null,
  };
}

async function searchMeals(query: string) {
  const res = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error(`TheMealDB error: ${res.status}`);

  const data = (await res.json()) as { meals: RawMeal[] | null };
  if (!data.meals) return { meals: [], total: 0 };

  return {
    total: data.meals.length,
    meals: data.meals.map(formatFullMeal),
  };
}

async function getMeal(id: string) {
  const res = await fetch(
    `${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`,
  );
  if (!res.ok) throw new Error(`TheMealDB error: ${res.status}`);

  const data = (await res.json()) as { meals: RawMeal[] | null };
  if (!data.meals || data.meals.length === 0) {
    throw new Error(`Meal not found for ID: "${id}"`);
  }

  return formatFullMeal(data.meals[0]);
}

async function randomMeal() {
  const res = await fetch(`${BASE_URL}/random.php`);
  if (!res.ok) throw new Error(`TheMealDB error: ${res.status}`);

  const data = (await res.json()) as { meals: RawMeal[] | null };
  if (!data.meals || data.meals.length === 0) {
    throw new Error('Failed to retrieve a random meal');
  }

  return formatFullMeal(data.meals[0]);
}

async function mealsByIngredient(ingredient: string) {
  const res = await fetch(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`,
  );
  if (!res.ok) throw new Error(`TheMealDB error: ${res.status}`);

  const data = (await res.json()) as { meals: SlimMeal[] | null };
  if (!data.meals) return { ingredient, meals: [], total: 0 };

  return {
    ingredient,
    total: data.meals.length,
    meals: data.meals.map(formatSlimMeal),
  };
}

export default { tools, callTool } satisfies McpToolExport;
