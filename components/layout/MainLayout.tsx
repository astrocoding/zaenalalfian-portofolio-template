import * as React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-[#dac0ca] selection:text-ink">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
