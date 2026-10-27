import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";
export const dynamic="force-dynamic";
export async function GET(req:Request){
  const {searchParams}=new URL(req.url);
  let list=await getProducts();
  const cat=searchParams.get("categoria"); const col=searchParams.get("coleccion"); const q=searchParams.get("buscar");
  if(cat) list=list.filter((p:any)=>p.category===cat);
  if(col) list=list.filter((p:any)=>p.collection===col);
  if(q) list=list.filter((p:any)=>(p.name+p.category+p.collection).toLowerCase().includes(q.toLowerCase()));
  return NextResponse.json({products:list});
}
