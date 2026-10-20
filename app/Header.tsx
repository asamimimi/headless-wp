import React from 'react'
import Link from 'next/link';
import { endpoint } from "@/lib/graphql";
import { cacheLife, cacheTag } from "next/cache";
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
        <header>
            <nav className="flex gap-4">
                {menuItems.map((item) => {

                    return (
                        <Link key={item.id} href={item.path}>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </header>
    )
}

export default Header