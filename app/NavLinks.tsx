'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = { id: string; label: string; path: string };

// 現在のパスと一致するメニューをアクティブ色にする
const NavLinks = ({ items }: { items: MenuItem[] }) => {
    const pathname = usePathname();

    return (
        <nav className="flex gap-9 font-mono text-sm font-medium leading-[1.4] whitespace-nowrap">
            {items.map((item) => {
                const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

                return (
                    <Link
                        key={item.id}
                        href={item.path}
                        aria-current={isActive ? 'page' : undefined}
                        className={`transition-colors hover:text-(--color-accent-primary-strong) ${isActive ? 'text-(--color-accent-primary-strong)' : 'text-(--color-text-primary)'}`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default NavLinks
