'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = { id: string; label: string; path: string };

// メニュー本体（pathname が未確定の間は null でアクティブ表示なし）
export const NavList = ({ items, pathname }: { items: MenuItem[]; pathname: string | null }) => {
    return (
        <nav className="flex gap-9 font-mono text-sm font-medium leading-[1.4] whitespace-nowrap">
            {items.map((item) => {
                const isActive = pathname !== null && (pathname === item.path || pathname.startsWith(`${item.path}/`));

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

// 現在のパスと一致するメニューをアクティブ色にする
const NavLinks = ({ items }: { items: MenuItem[] }) => {
    const pathname = usePathname();

    return <NavList items={items} pathname={pathname} />;
}

export default NavLinks
