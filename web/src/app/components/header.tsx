'use client'
import Link from 'next/link';
import { useState } from 'react';
import ThemeSwitch from './themeChanger/themeChanger';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Button from './buttons/button';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'FinTrack' }
    ]

    const handleClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <nav className='w-full flex flex-col md:flex-row justify-between items-center'>

                {/* desktop nav */}
                <div className='hidden md:flex px-20 py-4 w-full items-center justify-between'>
                    <ul className='flex gap-8'>
                        {navLinks.map(({ href, label }) => (
                            <li key={label}>
                                <Link className='nav-link' href={href}>{label}</Link>
                            </li>
                        ))}
                    </ul>

                    <div className='flex items-center gap-4'>
                        <Button size="md" type="primary" text='Log In' onClick={() => router.push('/login')} />
                        <Button size="md" type="outlined" text='Register' onClick={() => router.push('/register')} />
                        <ThemeSwitch />
                    </div>
                </div>

                {/* Mobile menu */}
                <div className='relative md:hidden w-full px-4'>
                    <button
                        type='button'
                        onClick={() => handleClick()}
                        className={` ms-auto mt-2 items-center  ${isMenuOpen ? 'rotate-90' : 'rotate-0'} transition delay-50 duration-300 `}
                        aria-controls='mobile-nav'
                        aria-expanded={isMenuOpen}
                    >
                        <HamburgerMenu />
                    </button>

                    {isMenuOpen && (
                        <ul
                            id='mobile-nav'
                            className={`w-full mb-4 flex flex-col md:hidden overflow-hidden`}
                        >
                            {navLinks.map(({ href, label }) => (
                                <li key={label} className='h-10 flex items-center'>
                                    <Link className={`w-full nav-link`} onClick={() => handleClick()} href={href}>{label}</Link>
                                </li>
                            ))}
                            <div className='grid grid-cols-2 gap-4 my-4'>
                                <Button size="md" type="primary" text='Log In' onClick={() => router.push('/login')} />
                                <Button size="md" type="outlined" text='Register' onClick={() => router.push('/register')} />
                            </div>

                            <div className='flex ms-auto items-center gap-4'>
                                <ThemeSwitch />
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
                    : `/hamburger-menu/hamburger-menu.svg`}
            alt={"icon of mobile navigation menu"}
            width={36}
            height={36}
            className={"hover"}
            unoptimized={true}
            loading='eager'
        />
    );
}