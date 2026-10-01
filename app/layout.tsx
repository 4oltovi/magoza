import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = { title: "Сохтмон Бохтар", description: "Бозори масолеҳи сохтмонӣ дар Бохтар" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="tg"><body>{children}</body></html>; }
