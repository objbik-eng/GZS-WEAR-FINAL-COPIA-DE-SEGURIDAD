import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
export async function POST(req:Request){
  try{
    const {email}=await req.json();
    if(!email || !email.includes("@")) return NextResponse.json({error:"Introduce un email válido"},{status:400});
    try{ await db.insert(subscribers).values({email}); }catch{}
    return NextResponse.json({message:"Ya eres del barrio. Revisa tu email: tienes tu -10% con BARRIO10."});
  }catch{ return NextResponse.json({error:"Error"},{status:500}); }
}
