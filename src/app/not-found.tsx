import Link from "next/link";
import { homePath, shopPath } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="container-gzs py-28 text-center max-w-xl">
      <p className="font-logo text-7xl text-gold">404</p>
      <h1 className="text-3xl font-black mt-4">Página no encontrada / Page not found</h1>
      <p className="text-smoke mt-3">
        La página que buscas no existe o ha sido movida.
      </p>
      <div className="flex gap-4 justify-center mt-8">
        <Link href={shopPath("es")} className="btn btn-primary">Ir a la tienda</Link>
        <Link href={homePath("es")} className="btn btn-outline">Inicio</Link>
      </div>
    </div>
  );
}
