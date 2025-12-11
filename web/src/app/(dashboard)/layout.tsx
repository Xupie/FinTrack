import { Metadata } from "next";
import { Providers } from "../providers";
import DashboardHeader from "./components/header";

export const metadata: Metadata = {
  title: "FinTrack - Dashboard",
  description: "FinTrack - Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <DashboardHeader/>
      {children}
    </Providers>
  );
}
