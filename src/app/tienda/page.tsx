import { getProducts } from "@/lib/catalog";
import ShopClient from "./ShopClient";
export const dynamic="force-dynamic";
export default async function TiendaPage({searchParams}:{searchParams:Promise<any>}){
  const sp=await searchParams;
  const products=await getProducts();
  return <ShopClient products={products} initial={{categoria:sp.categoria||"", coleccion:sp.coleccion||"", buscar:sp.buscar||"", filtro:sp.filtro||""}}/>
}
