import { REVIEWS_SEED, DEFAULT_REVIEWS } from "./seed-data";
export function ratingFor(productId:number, slug?:string){
  const revs = slug ? (REVIEWS_SEED[slug]||DEFAULT_REVIEWS) : DEFAULT_REVIEWS;
  const avg = revs.reduce((a,b)=>a+b.rating,0)/revs.length;
  return { avg: Math.round(avg*10)/10, count: revs.length + (productId*3)%17 + 6 };
}
