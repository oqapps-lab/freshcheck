// Static, data-driven home content. Easy to extend — just add rows.

export type StorageItem = { food: string; emoji: string; store: string; life: string; temp: string };

export const STORAGE_GUIDE: StorageItem[] = [
  { food: "Bananas", emoji: "🍌", store: "On the counter, away from other fruit", life: "2–7 days", temp: "Room temp" },
  { food: "Berries", emoji: "🫐", store: "Unwashed, in a paper-towel-lined box", life: "3–7 days", temp: "Fridge 1–4°C" },
  { food: "Eggs", emoji: "🥚", store: "In the carton, on a shelf (not the door)", life: "3–5 weeks", temp: "Fridge ≤4°C" },
  { food: "Leafy greens", emoji: "🥬", store: "Wrapped loosely in a dry towel", life: "5–7 days", temp: "Fridge 1–4°C" },
  { food: "Chicken", emoji: "🍗", store: "Sealed, on the bottom shelf", life: "1–2 days", temp: "Fridge ≤4°C" },
  { food: "Cooked leftovers", emoji: "🍱", store: "Airtight, cooled within 2 hours", life: "3–4 days", temp: "Fridge ≤4°C" },
  { food: "Hard cheese", emoji: "🧀", store: "Wrapped in wax/parchment, not plastic", life: "3–4 weeks", temp: "Fridge 1–4°C" },
  { food: "Tomatoes", emoji: "🍅", store: "On the counter, stem-side down", life: "4–7 days", temp: "Room temp" },
  { food: "Bread", emoji: "🍞", store: "Paper bag at room temp, or freeze", life: "2–4 days", temp: "Room temp" },
  { food: "Fish", emoji: "🐟", store: "On ice, sealed, bottom shelf", life: "1–2 days", temp: "Fridge ≤2°C" },
  { food: "Carrots", emoji: "🥕", store: "Tops removed, in water or a sealed bag", life: "2–4 weeks", temp: "Fridge 1–4°C" },
  { food: "Milk", emoji: "🥛", store: "Coldest shelf, not the door", life: "5–7 days after open", temp: "Fridge ≤4°C" },
];

export type ChefTip = { chef: string; role: string; tip: string };

export const CHEF_TIPS: ChefTip[] = [
  { chef: "Gordon Ramsay", role: "Michelin chef", tip: "Taste as you go. Season in layers, not all at the end." },
  { chef: "Massimo Bottura", role: "Osteria Francescana", tip: "Yesterday's bread becomes today's masterpiece — never waste it." },
  { chef: "Julia Child", role: "Author & TV chef", tip: "Don't crowd the pan — give food room or it steams instead of browns." },
  { chef: "Yotam Ottolenghi", role: "Chef & author", tip: "A squeeze of lemon at the end wakes up almost any dish." },
  { chef: "Marco Pierre White", role: "Michelin chef", tip: "Let meat rest after cooking — the juices redistribute." },
  { chef: "Nigella Lawson", role: "Food writer", tip: "Freeze herbs in olive oil in an ice tray before they wilt." },
  { chef: "Thomas Keller", role: "The French Laundry", tip: "Pat proteins dry before searing — moisture is the enemy of a crust." },
  { chef: "Samin Nosrat", role: "Salt Fat Acid Heat", tip: "Salt from a height so it falls evenly across the food." },
];

export type FoodFact = { title: string; body: string };

export const FOOD_FACTS: FoodFact[] = [
  { title: "The smell test lies", body: "Dangerous bacteria like salmonella don't change how food smells, looks or tastes." },
  { title: "The danger zone", body: "Bacteria multiply fastest between 4–60°C. Refrigerate leftovers within 2 hours." },
  { title: "Ripen with apples", body: "Apples and bananas release ethylene — keep them away from greens to slow spoilage." },
  { title: "Freezing pauses time", body: "Freezing doesn't kill bacteria, it just stops them. They wake up when thawed." },
];
