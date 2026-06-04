import type { FridgeCategory } from '@/src/lib/database.types';

/**
 * Barcode -> product lookup via OpenFoodFacts (free, key-less). Maps the
 * product to a FridgeCategory + a default shelf-life (a GTIN carries no
 * expiry, so we seed a sensible per-category default the user can edit).
 * Unknown codes -> null (caller falls back to the AI photo scan).
 */
export type BarcodeProduct = {
  name: string;
  brand?: string;
  category: FridgeCategory;
  shelfLifeDays: number;
  imageUrl?: string;
};

const SHELF_LIFE: Record<FridgeCategory, number> = {
  dairy: 7,
  poultry: 2,
  meat: 3,
  fish: 2,
  produce: 5,
  bakery: 4,
  pantry: 180,
};

// OFF categories_tags (en:-prefixed taxonomy) -> our FridgeCategory.
function categoryFromTags(tags: string[]): FridgeCategory {
  const t = tags.join(' ');
  const has = (...ks: string[]) => ks.some((k) => t.includes(k));
  if (has('en:milks', 'en:dairies', 'en:yogurts', 'en:cheeses', 'en:creams', 'en:butters', 'dairy')) return 'dairy';
  if (has('en:poultry', 'en:chickens', 'en:turkeys', 'chicken')) return 'poultry';
  if (has('en:seafood', 'en:fishes', 'en:fish', 'en:salmons', 'en:tunas')) return 'fish';
  if (has('en:meats', 'en:beef', 'en:pork', 'en:hams', 'en:sausages', 'en:bacons')) return 'meat';
  if (has('en:breads', 'en:bakery', 'en:baguettes', 'en:viennoiseries')) return 'bakery';
  if (has('en:fresh-vegetables', 'en:fresh-fruits', 'en:fruits', 'en:vegetables', 'en:salads')) return 'produce';
  return 'pantry';
}

const cache = new Map<string, BarcodeProduct | null>();

export async function lookupBarcode(code: string): Promise<BarcodeProduct | null> {
  if (cache.has(code)) return cache.get(code) ?? null;
  try {
    const url =
      'https://world.openfoodfacts.org/api/v2/product/' +
      encodeURIComponent(code) +
      '.json?fields=product_name,product_name_en,brands,categories_tags,image_front_small_url,quantity';
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FreshCheck/0.2 (vitaminico.sup@gmail.com)' },
    });
    if (!res.ok) {
      cache.set(code, null);
      return null;
    }
    const json = (await res.json()) as {
      status?: number;
      product?: {
        product_name?: string;
        product_name_en?: string;
        brands?: string;
        categories_tags?: string[];
        image_front_small_url?: string;
        quantity?: string;
      };
    };
    const p = json.product;
    const rawName = (p?.product_name || p?.product_name_en || p?.brands || '').trim();
    if (!p || !rawName) {
      cache.set(code, null);
      return null;
    }
    const category = categoryFromTags(p.categories_tags ?? []);
    const name = p.quantity ? `${rawName} ${p.quantity.trim()}` : rawName;
    const product: BarcodeProduct = {
      name,
      brand: p.brands?.split(',')[0]?.trim(),
      category,
      shelfLifeDays: SHELF_LIFE[category],
      imageUrl: p.image_front_small_url,
    };
    cache.set(code, product);
    return product;
  } catch {
    return null;
  }
}
