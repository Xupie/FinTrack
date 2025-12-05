"use client"

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import styles from './themeChanger.module.css'

// https://www.npmjs.com/package/next-themes#avoid-hydration-mismatch
export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, []);

  if (!mounted) {
    return null
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="opacity-0 peer"
        checked={theme === "dark"}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
      />
      <span
      className={`${styles['theme-switch']} peer peer-checked:after:translate-x-full`}
      ></span>
    </label>
  )
}