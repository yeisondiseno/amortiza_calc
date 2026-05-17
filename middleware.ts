import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Excluye assets internos, archivos con extensión y las rutas de metadata
  // generadas por App Router (`app/icon.tsx`, `app/apple-icon.tsx`, etc.)
  // que se sirven sin prefijo de locale.
  matcher: ["/((?!_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
