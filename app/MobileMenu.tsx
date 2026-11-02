'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';

type MenuItem = { id: string; label: string; path: string };

// SP用のハンバーガーメニュー（ヘッダー直下にメニューを展開する）
const MobileMenu = ({ items }: { items: MenuItem[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
                className="flex size-6 items-center justify-center"
            >
                {isOpen ? (
                    <X size={22} strokeWidth={1.6} className="text-(--color-text-primary)" />
                ) : (
                    <Image src="/Top/Header/icon-menu.svg" alt="" width={24} height={24} />
                )}
            </button>

            {isOpen && (
                <nav
                    id="mobile-menu"
                    className="absolute inset-x-0 top-full border-b border-(--color-border-default) bg-(--color-bg-base) px-5 py-4"
                >
                    <ul className="flex flex-col font-mono text-sm leading-[1.4] font-medium">
                        {items.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block py-3 text-(--color-text-primary) transition-colors hover:text-(--color-accent-primary-strong)"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </>
    );
}

export default MobileMenu
