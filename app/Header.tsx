import React, { Suspense } from 'react'
import Link from 'next/link';
import { endpoint } from "@/lib/graphql";
import { cacheLife, cacheTag } from "next/cache";
import Image from 'next/image';
import NavLinks, { NavList } from './NavLinks';
import SearchDialog from './SearchDialog';
import MobileMenu from './MobileMenu';
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
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-(--color-border-default) bg-(--color-bg-base)/90 px-5 py-3.5 backdrop-blur-[10px] lg:bg-(--color-bg-base)/85 lg:px-20 lg:py-5">
            <h1>
                <Link href="/">
                    <Image
                        src="/Top/Header/Logo.svg"  // 画像のパス
                        alt="asami.dev"  // 代替テキスト（必須）
                        width={168}  // 幅（必須）
                        height={32}  // 高さ（必須）
                        priority
                        className="h-[27.2px] w-auto lg:h-8"
                    />
                </Link>
            </h1>
            {/* 動的ルートでは pathname がリクエスト時まで確定しないため Suspense で囲む */}
            <div className="hidden lg:block">
                <Suspense fallback={<NavList items={menuItems} pathname={null} />}>
                    <NavLinks items={menuItems} />
                </Suspense>
            </div>
            <div className="flex items-center gap-4">
                <SearchDialog />
                <a href="https://github.com/asamimimi" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hidden lg:block">
                    <Image src="/Top/Header/icon-github.svg" alt="" width={20} height={20} />
                </a>
                {/* SPのみハンバーガーメニュー */}
                <div className="lg:hidden">
                    <MobileMenu items={menuItems} />
                </div>
            </div>
        </header>
    )
}

export default Header