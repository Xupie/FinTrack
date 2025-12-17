"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/app/components/buttons/button";

export default function DashboardHeader() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/management", label: "Management" },
    { href: "/settings", label: "Settings" },
  ];

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  return (
    <header>
      <nav className="w-full flex flex-col md:flex-row justify-between items-center">
        {/* desktop nav */}
        <div className="hidden md:flex px-20 py-4 w-full items-center justify-between">
          <h1 className="text-2xl">
            <Link href={`/`}>FinTrack</Link>
          </h1>

          <div className="flex items-center gap-4">
            <p>Logged in as <strong>{username}</strong></p>
            <Button
              size="md"
              type="primary"
              text="Logout"
              onClick={() => router.push("/logout")}
            />
          </div>
        </div>

        {/* Mobile menu */}
        <div className="relative md:hidden w-full px-4">
          <div className="flex gap-4 ms-auto mt-2 items-center">
            <button
              type="button"
              onClick={() => handleClick()}
              className={`${isMenuOpen ? "rotate-90" : "rotate-0"} transition delay-50 duration-300`}
              aria-controls="mobile-nav"
              aria-expanded={isMenuOpen}
            >
              <HamburgerMenu />
            </button>
            <h1 className="text-2xl">
              <Link href={`/`}>FinTrack</Link>
            </h1>
          </div>

          {isMenuOpen && (
            <ul
              id="mobile-nav"
              className={`w-full mb-4 flex flex-col md:hidden overflow-hidden`}
            >
              {navLinks.map(({ href, label }) => (
                <li key={label} className="h-10 flex items-center">
                  <Link
                    className={`w-full nav-link`}
                    onClick={() => handleClick()}
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <div className="gap-4 my-4 flex ms-auto items-center">
                <p>Logged in as <strong>{username}</strong></p>

                <Button
                  size="md"
                  type="primary"
                  text="Logout"
                  onClick={() => router.push("/logout")}
                />
              </div>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}

export function HamburgerMenu() {
  const { resolvedTheme } = useTheme();
  return (
    <Image
      src={
        resolvedTheme === "dark"
          ? `/hamburger-menu/hamburger-menu-white.svg`
          : `/hamburger-menu/hamburger-menu.svg`
      }
      alt={"icon of mobile navigation menu"}
      width={36}
      height={36}
      className={"hover"}
      unoptimized={true}
      loading="eager"
    />
  );
}
