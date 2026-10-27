"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type CartItem = { productId:number; slug:string; name:string; price:number; image:string; size:string; color:string; qty:number; };
type CartCtx = { items:CartItem[]; add:(i:CartItem)=>void; remove:(slug:string,size:string,color:string)=>void; updateQty:(slug:string,size:string,color:string,qty:number)=>void; clear:()=>void; subtotal:number; count:number; isOpen:boolean; setOpen:(v:boolean)=>void; lastAdded:string|null; wishlist:string[]; toggleWish:(slug:string)=>void; };
const Ctx = createContext<CartCtx|null>(null);

export function CartProvider({children}:{children:ReactNode}){
  const [items,setItems]=useState<CartItem[]>([]);
  const [wishlist,setWishlist]=useState<string[]>([]);
  const [isOpen,setOpen]=useState(false);
  const [lastAdded,setLastAdded]=useState<string|null>(null);
  const [hydrated,setHydrated]=useState(false);

  useEffect(()=>{ try{ const c=localStorage.getItem("gzs-cart"); if(c) setItems(JSON.parse(c)); const w=localStorage.getItem("gzs-wish"); if(w) setWishlist(JSON.parse(w)); }catch{} setHydrated(true); },[]);
  useEffect(()=>{ if(hydrated) localStorage.setItem("gzs-cart", JSON.stringify(items)); },[items,hydrated]);
  useEffect(()=>{ if(hydrated) localStorage.setItem("gzs-wish", JSON.stringify(wishlist)); },[wishlist,hydrated]);

  const add=(item:CartItem)=>{ setItems(prev=>{ const idx=prev.findIndex(i=>i.slug===item.slug&&i.size===item.size&&i.color===item.color); if(idx>=0){ const n=[...prev]; n[idx]={...n[idx], qty:n[idx].qty+item.qty}; return n; } return [...prev,item]; }); setLastAdded(item.name); setOpen(true); setTimeout(()=>setLastAdded(null),3000); };
  const remove=(slug:string,size:string,color:string)=> setItems(prev=>prev.filter(i=>!(i.slug===slug&&i.size===size&&i.color===color)));
  const updateQty=(slug:string,size:string,color:string,qty:number)=> setItems(prev=> qty<=0? prev.filter(i=>!(i.slug===slug&&i.size===size&&i.color===color)) : prev.map(i=> i.slug===slug&&i.size===size&&i.color===color? {...i,qty}:i));
  const clear=()=>setItems([]);
  const toggleWish=(slug:string)=> setWishlist(prev=> prev.includes(slug)? prev.filter(s=>s!==slug): [...prev,slug]);
  const subtotal=useMemo(()=>items.reduce((a,i)=>a+i.price*i.qty,0),[items]);
  const count=useMemo(()=>items.reduce((a,i)=>a+i.qty,0),[items]);
  return <Ctx.Provider value={{items,add,remove,updateQty,clear,subtotal,count,isOpen,setOpen,lastAdded,wishlist,toggleWish}}>{children}</Ctx.Provider>
}
export function useCart(){ const c=useContext(Ctx); if(!c) throw new Error("useCart"); return c; }
