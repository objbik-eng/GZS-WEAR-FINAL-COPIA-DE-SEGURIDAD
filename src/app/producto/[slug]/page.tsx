import { getProductBySlug, getProducts } from "@/lib/catalog";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
export const dynamic="force-dynamic";
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=await getProductBySlug(slug);
  if(!product) notFound();
  const all=await getProducts();
  const related=all.filter((p:any)=>p.slug!==slug && (p.category===product.category || p.collection===product.collection)).slice(0,4);
  return <ProductDetailClient product={product} related={related}/>
}
