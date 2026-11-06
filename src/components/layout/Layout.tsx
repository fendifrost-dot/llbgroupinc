import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Seo } from "@/components/seo/Seo";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Seo />
      <Header />
      <main className="flex-1 pt-[73px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
