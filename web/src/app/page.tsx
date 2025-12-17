"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Carousel from "./(dashboard)/components/carousel";
import Button from "./components/buttons/button";
import Footer from "./components/footer";
import Header from "./components/header";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center my-4">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Manage Your <span className="text-primary">Finances</span> with
              Confidence
            </h1>

            <p className="text-gray-400 text-lg">
              FinTrack helps you keep track of your expenses, organize
              categories, and get a clear view of how you spend your money.
            </p>

            <div className="flex gap-4">
              <Button
                text="Get Started"
                size="lg"
                type="primary"
                onClick={() => router.push("/register")}
              />
              <Button
                text="Learn More"
                size="lg"
                type="outlined"
                onClick={() => router.push("/register")}
              />
            </div>
          </div>

          {/* Images */}
          <div className="relative w-full h-160 md:h-[420px]">
            {/* Desktop Image */}
            <Image
              src="/examples/desktop/1.png"
              alt="FinTrack dashboard"
              fill
              className="hidden md:block object-contain"
              priority
            />
            {/* Mobile Image */}
            <Image
              src="/examples/mobile/1.png"
              alt="FinTrack mobile dashboard"
              fill
              className="md:hidden object-contain"
              priority
            />
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">📊 Expense Tracking</h3>
            <p className="text-gray-400">
              Easily record and organize your income and expenses by category.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">
              📱 Works on Any Device
            </h3>
            <p className="text-gray-400">
              A responsive design that looks good on desktop and mobile.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">🔒 Data Privacy</h3>
            <p className="text-gray-400">
              Your financial information is stored securely and handled with
              care.
            </p>
          </div>
        </section>

        <section className="w-4/5 mx-auto hidden md:block object-contain">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            A simple overview of your finances
          </h2>
          <p className="text-gray-400 text-center mb-8">
            See your spending, categories, and summaries at a glance.
          </p>
          <div className="bg-surface p-10 rounded-2xl relative-h">
            <Carousel>
              <Image
                src="/examples/desktop/1.png"
                alt="FinTrack dashboard"
                fill
                className="hidden md:block object-contain"
                priority
              />
              <Image
                src="/examples/desktop/2.png"
                alt="FinTrack dashboard"
                fill
                className="hidden md:block object-contain"
                priority
              />
              <Image
                src="/examples/desktop/3.png"
                alt="FinTrack dashboard"
                fill
                className="hidden md:block object-contain"
                priority
              />
            </Carousel>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
