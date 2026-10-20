import React from 'react'
import Link from 'next/link';
import { endpoint } from "@/lib/graphql";
import { cacheLife, cacheTag } from "next/cache";
import Image from 'next/image';
import NavLinks from './NavLinks';
type MenuItem = { id: string; label: string; path: string };

// WordPressやGraphQLからメニューを取得する関数（イメージ）
async function getNavigationMenu(): Promise<MenuItem[]> {
    "use cache";
    cacheLife("hours");
    cacheTag("menu");


    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
        query NavQuery {
            menuItems(where: {location: PRIMARY_MENU}) {
                nodes {
                id
                label
                description
                path
                }
            }
            }
      `, // 上記のGraphQLクエリ
        }),
    });
    const json = await res.json();

    console.log(res)
    return json.data.menuItems.nodes;
}

const Header = async () => {
    const menuItems = await getNavigationMenu();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-(--color-border-default) bg-(--color-bg-base)/85 px-20 py-5 backdrop-blur-[10px]">
            <h1>
                <Link href="/">
                    <Image
                        src="/Top/Header/Logo.svg"  // 画像のパス
                        alt="lumina.dev"  // 代替テキスト（必須）
                        width={168}  // 幅（必須）
                        height={32}  // 高さ（必須）
                        priority
                    />
                </Link>
            </h1>
            <NavLinks items={menuItems} />
            <div className="flex items-center gap-4">
                {/* 検索機能は未実装のため見た目のみ */}
                <button
                    type="button"
                    className="flex items-center gap-6 rounded-[10px] border border-(--color-border-default) bg-(--color-bg-surface) py-2 pr-3 pl-4 font-mono text-xs font-medium leading-[1.4] tracking-[0.48px] text-(--color-text-secondary)"
                >
                    <Image src="/Top/Header/icon-search.svg" alt="" width={18} height={18} />
                    <span>Search articles</span>
                    <kbd className="rounded bg-(--color-bg-subtle) px-1.5 py-0.5 font-mono">⌘K</kbd>
                </button>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Image src="/Top/Header/icon-github.svg" alt="" width={20} height={20} />
                </a>
                <a href="/feed" aria-label="RSS">
                    <Image src="/Top/Header/icon-rss.svg" alt="" width={20} height={20} />
                </a>
            </div>
        </header>
    )
}

export default Header