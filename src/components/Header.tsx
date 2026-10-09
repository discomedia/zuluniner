'use client';

import { useState } from 'react';
import Link from 'next/link';

const navigation = [
  { name: 'Browse', href: '/aircraft' },
  { name: 'Sell', href: '/sell' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary-600">ZuluNiner</Link>
          <nav className="hidden md:flex space-x-8">
            {navigation.map(item => <Link key={item.href} href={item.href} className="text-neutral-600 hover:text-primary-600 text-sm font-medium">{item.name}</Link>)}
          </nav>
          <button className="md:hidden p-2 text-neutral-600" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
        {open && <nav className="md:hidden border-t border-neutral-200 py-3">{navigation.map(item => <Link key={item.href} href={item.href} className="block px-3 py-2 text-neutral-600" onClick={() => setOpen(false)}>{item.name}</Link>)}</nav>}
      </div>
    </header>
  );
}
