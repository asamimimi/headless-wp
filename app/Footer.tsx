"use cache";
import Link from 'next/link';
import Image from 'next/image';
import { endpoint } from "@/lib/graphql";
import { cacheLife, cacheTag } from "next/cache";

type FooterLink = { id: string; label: string; path: string; description: string };

// WordPressやGraphQLからメニューを取得する関数（イメージ）
async function getFooterMenu_L(): Promise<FooterLink[]> {

    cacheLife("hours");
    cacheTag("menu");


    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
        query NavQuery {
            menuItems(where: {location:  FOOTERNAV_L}) {
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
async function getFooterMenu_R(): Promise<FooterLink[]> {

    cacheLife("hours");
    cacheTag("menu");


    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
        query NavQuery {
            menuItems(where: {location:  FOOTERNAV_R}) {
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

const Footer = async () => {
    const footer_L_menuItems = await getFooterMenu_L();
    const footer_R_menuItems = await getFooterMenu_R();

    return (
        <footer className="relative overflow-hidden bg-(--color-bg-deep)">
            {/* 背景のぼかし */}
            <Image
                src="/Footer/aurora.svg"
                alt=""
                width={840}
                height={660}
                className="pointer-events-none absolute -top-80 -right-45 max-w-none"
            />

            <div className="relative mx-auto flex w-full max-w-360 flex-col gap-14 px-5 pt-16 pb-8 lg:px-20 lg:pt-20">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col items-start gap-4">
                        <Link href="/" className="flex items-center gap-2.5" aria-label="lumina.dev">
                            <span className="flex size-8 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#7b61ff_0%,#c46bff_35.714%,#ff8cc6_71.429%)] font-mono text-[11px] leading-[1.4] font-medium tracking-[-0.44px] text-(--color-text-inverse)">
                                {'</>'}
                            </span>
                            <span className="font-display text-[26px] leading-[1.2] font-semibold tracking-[-0.52px]">
                                <span className="text-(--color-text-inverse)">lumina</span>
                                <span className="text-(--color-accent-primary)">.dev</span>
                            </span>
                        </Link>
                        <p className="font-plex text-[13px] leading-[1.7] tracking-[0.39px] text-(--color-text-inverse) opacity-75">
                            やさしく、確かに、未来をつくる。
                            <br />
                            女性エンジニアが綴る、Web とクラウドと AI の技術ノート。
                        </p>
                    </div>

                    <nav className="flex gap-18" aria-label="フッターメニュー">

                        <div className="flex flex-col items-start gap-3">
                            <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-primary-soft)">
                                Category
                            </p>

                            <ul className="flex flex-col items-start gap-3">
                                {footer_L_menuItems.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.path}
                                            className="font-plex text-[13px] leading-[1.7] tracking-[0.39px] text-(--color-text-inverse) opacity-85 transition-opacity hover:opacity-100"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col items-start gap-3">
                            <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-primary-soft)">
                                About
                            </p>
                            <ul className="flex flex-col items-start gap-3">
                                {footer_R_menuItems.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            href={item.path}
                                            className="font-plex text-[13px] leading-[1.7] tracking-[0.39px] text-(--color-text-inverse) opacity-85 transition-opacity hover:opacity-100"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </nav>
                </div>

                <div className="h-px w-full bg-(--color-text-inverse) opacity-12" />

                <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-inverse) opacity-60">
                        © 2026 lumina.dev — Built with Next.js &amp; WordPress
                    </p>
                    <div className="flex items-start gap-4">
                        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Image src="/Footer/icon-github.svg" alt="" width={20} height={20} />
                        </a>
                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X">
                            <Image src="/Footer/icon-x.svg" alt="" width={20} height={20} />
                        </a>
                        <a href="/feed" aria-label="RSS">
                            <Image src="/Footer/icon-rss.svg" alt="" width={20} height={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
