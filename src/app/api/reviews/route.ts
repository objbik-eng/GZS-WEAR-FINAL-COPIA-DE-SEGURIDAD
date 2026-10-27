import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/catalog";
export async function POST(req:Request){
  try{
    await ensureSeeded();
    const b=await req.json();
    if(!b.productSlug || !b.author || !b.title || !b.body || !b.rating) return NextResponse.json({error:"Completa todos los campos"},{status:400});
    const [p]=await db.select().from(products).where(eq(products.slug,b.productSlug)).limit(1);
    if(!p) return NextResponse.json({error:"Producto no encontrado"},{status:404});
    const [rev]=await db.insert(reviews).values({productId:p.id, author:b.author, rating:Math.min(5,Math.max(1,Number(b.rating))), title:b.title, body:b.body, sizeBought:b.sizeBought||null, verified:false}).returning();
    return NextResponse.json({review:rev, message:"¡Gracias! Tu reseña ya está publicada."});
  }catch(e){ return NextResponse.json({error:"No se pudo publicar la reseña"},{status:500}); }
}
