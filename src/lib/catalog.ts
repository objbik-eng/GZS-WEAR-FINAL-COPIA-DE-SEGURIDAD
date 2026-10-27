import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { PRODUCTS, REVIEWS_SEED, DEFAULT_REVIEWS } from "./seed-data";
import { eq, desc } from "drizzle-orm";

let seeded = false;
export async function ensureSeeded(){
  if(seeded) return;
  try{
    const existing = await db.select({id:products.id}).from(products).limit(1);
    if(existing.length===0){
      const inserted = await db.insert(products).values(PRODUCTS.map(p=>({
        slug:p.slug, name:p.name, category:p.category, collection:p.collection, price:p.price, compareAt:p.compareAt||null,
        description:p.description, fabric:p.fabric, fit:p.fit, images:p.images, sizes:p.sizes, colors:p.colors, tag:p.tag||null, isNew:!!p.isNew, isBestSeller:!!p.isBestSeller, stock:p.stock
      }))).returning();
      for(const prod of inserted){
        const revs = REVIEWS_SEED[prod.slug] || DEFAULT_REVIEWS;
        await db.insert(reviews).values(revs.map(r=>({ productId:prod.id, author:r.author, rating:r.rating, title:r.title, body:r.body, sizeBought:r.sizeBought||null })));
      }
    }
    seeded = true;
  }catch(e){ console.error("seed error", e); }
}

export async function getProducts(){
  await ensureSeeded();
  try{ return await db.select().from(products).orderBy(desc(products.createdAt), products.id); }
  catch{ return PRODUCTS.map((p,i)=>({id:i+1, ...p, compareAt:p.compareAt||null, tag:p.tag||null, isNew:!!p.isNew, isBestSeller:!!p.isBestSeller, createdAt:new Date()})) as any[]; }
}
export async function getProductBySlug(slug:string){
  await ensureSeeded();
  try{
    const [p] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if(!p) return null;
    const revs = await db.select().from(reviews).where(eq(reviews.productId, p.id)).orderBy(desc(reviews.createdAt));
    return {...p, reviews: revs};
  }catch{
    const p = PRODUCTS.find(x=>x.slug===slug); if(!p) return null;
    return {...p, id:1, compareAt:p.compareAt||null, tag:p.tag||null, isNew:!!p.isNew, isBestSeller:!!p.isBestSeller, reviews:(REVIEWS_SEED[slug]||DEFAULT_REVIEWS).map((r,i)=>({id:i+1,...r, productId:1, verified:true, createdAt:new Date(), sizeBought:r.sizeBought||null}))} as any;
  }
}
export function ratingFor(productId:number, slug?:string){
  // deterministic pseudo rating from slug
  const seedReviews = slug ? (REVIEWS_SEED[slug]||DEFAULT_REVIEWS) : DEFAULT_REVIEWS;
  const avg = seedReviews.reduce((a,b)=>a+b.rating,0)/seedReviews.length;
  return { avg: Math.round(avg*10)/10, count: seedReviews.length + (productId*3)%17 + 6 };
}
