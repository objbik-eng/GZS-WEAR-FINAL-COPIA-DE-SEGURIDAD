import Link from "next/link";
export function LogoMark({variant="green", size=44}:{variant?:"green"|"white"|"black"; size?:number}){
  const main = variant==="white" ? "#fff" : variant==="black" ? "#0E0E0E" : "#5E845F";
  return (
    <span className="inline-flex items-start leading-none select-none" aria-label="GZS Wear">
      <span className="font-logo" style={{color:main, fontSize:size, lineHeight:.85, letterSpacing:"-0.02em"}}>GZS</span>
      <span className="flex flex-col ml-1.5 mt-1">
        <span className="font-display italic font-black" style={{color:main, fontSize:size*0.32, lineHeight:1}}>Wear.</span>
        <span className="font-display font-black animate-spin-slow inline-block origin-center" style={{color:"#D39905", fontSize:size*0.42, lineHeight:1}}>*</span>
      </span>
    </span>
  );
}
export default function Logo({variant="green"}:{variant?:"green"|"white"|"black"}){
  return <Link href="/" className="shrink-0 hover:opacity-90 transition"><LogoMark variant={variant} size={38}/></Link>
}
