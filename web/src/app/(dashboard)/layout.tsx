import { Metadata } from "next";
import { Providers } from "../providers";
import Header from "./components/header";

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
      <Header />
      {children}
    </Providers>
  );
}
