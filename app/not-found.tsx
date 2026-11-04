"use cache";
import Link from 'next/link';
import Image from 'next/image';
import { cacheLife, cacheTag } from "next/cache";
import { PostGrid } from './components/PostCard';
import { fetchLatestPosts } from '@/lib/blogApi';

export default async function NotFound() {
    cacheLife("hours");
    cacheTag("posts");

    const recommendedPosts = await fetchLatestPosts(3);

    return (
        <div>
            <section className="relative overflow-hidden">
                {/* 背景（グリッド・オーロラ） */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-360 -translate-x-1/2">
                    <div className="absolute top-0 left-0 h-225 w-360">
                        <Image src="/NotFound/bg-grid.svg" alt="" fill />
                    </div>
                    <div className="absolute top-10 left-35 h-115 w-140">
                        <div className="absolute inset-[-30.43%_-25%]">
                            <Image src="/NotFound/aurora-1.svg" alt="" fill />
                        </div>
                    </div>
                    <div className="absolute top-80 left-215 h-90 w-105">
                        <div className="absolute inset-[-38.89%_-33.33%]">
                            <Image src="/NotFound/aurora-2.svg" alt="" fill />
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto flex w-full max-w-360 flex-col items-center gap-6 px-5 pt-24 pb-28 text-center lg:px-35">
                    <p className="flex items-center gap-2 rounded-full border border-(--color-accent-primary-soft) bg-(--color-bg-surface) py-1.5 pr-3.5 pl-3 font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-pink)">
                        <Image src="/NotFound/badge-dot.svg" alt="" width={8} height={8} />
                        Error: 404 Not Found
                    </p>
                    <h1 className="flex flex-col items-center gap-6">
                        <span className="bg-linear-to-r from-[#7b61ff] via-[#c46bff] to-[#ff8cc6] bg-clip-text font-display text-[120px] leading-none font-extralight tracking-[-8px] text-transparent lg:text-[200px]">
                            404
                        </span>
                        <span className="font-plex text-2xl leading-normal font-bold tracking-[0.64px] text-(--color-text-primary) lg:text-[32px]">
                            お探しのページが見つかりませんでした
                        </span>
                    </h1>
                    <p className="font-plex text-base leading-loose tracking-[0.48px] text-(--color-text-secondary)">
                        URL が変更されたか、ページが移動・削除された可能性があります。<br />
                        キーワードで検索するか、トップページから記事を探してみてください。
                    </p>

                    {/* ターミナル風の装飾 */}
                    <div className="w-full max-w-140 overflow-hidden rounded-2xl bg-(--color-code-bg) text-left">
                        <div className="flex items-center gap-2 px-4 py-3">
                            <Image src="/Article/code-dot-1.svg" alt="" width={10} height={10} />
                            <Image src="/Article/code-dot-2.svg" alt="" width={10} height={10} />
                            <Image src="/Article/code-dot-3.svg" alt="" width={10} height={10} />
                            <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-code-comment)">zsh — asami.dev</p>
                        </div>
                        <div className="overflow-x-auto px-5 pt-4 pb-5 font-mono text-sm leading-[1.8] whitespace-nowrap text-(--color-code-text)">
                            <p><span className="text-(--color-code-function)">$ </span>curl -I https://asami.dev/this-page</p>
                            <p>HTTP/2 <span className="text-(--color-code-keyword)">404 Not Found</span></p>
                            <p className="text-(--color-code-comment)"># でも大丈夫。おすすめの記事を見つけておきました ♡</p>
                        </div>
                    </div>

                    {/* 検索機能は未実装のため見た目のみ */}
                    <div className="flex w-full max-w-140 items-center gap-3.5 rounded-2xl border-[1.5px] border-(--color-accent-primary) bg-(--color-bg-surface) py-2.5 pr-2.5 pl-6 shadow-[0px_12px_32px_0px_rgba(122,97,255,0.12)]">
                        <Image src="/NotFound/icon-search.svg" alt="" width={20} height={20} />
                        <p className="flex-1 text-left font-plex text-base leading-loose tracking-[0.48px] text-(--color-text-secondary)">キーワードで記事を検索</p>
                        <span className="rounded-[10px] bg-[linear-gradient(156.72deg,#7b61ff_0%,#c46bff_35.714%,#ff8cc6_71.429%)] px-5 py-2.5 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-inverse)">
                            Search
                        </span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 rounded-full bg-[linear-gradient(164.93deg,#7b61ff_0%,#c46bff_35.714%,#ff8cc6_71.429%)] py-3.5 pr-6 pl-7 font-plex text-sm leading-normal font-semibold tracking-[0.84px] text-(--color-text-inverse) drop-shadow-[0px_16px_20px_rgba(92,64,224,0.1)] transition-opacity hover:opacity-90"
                        >
                            トップページへ戻る
                            <Image src="/Top/Mv/icon-arrow-white.svg" alt="" width={16} height={16} />
                        </Link>
                        <Link
                            href="/posts"
                            className="flex items-center gap-2.5 rounded-full border border-(--color-border-default) bg-(--color-bg-surface) py-3.5 pr-6 pl-7 font-plex text-sm leading-normal font-semibold tracking-[0.84px] text-(--color-text-primary) transition-colors hover:border-(--color-accent-primary)"
                        >
                            記事一覧を見る
                            <Image src="/Top/Mv/icon-arrow.svg" alt="" width={16} height={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {recommendedPosts.length > 0 && (
                <section className="bg-(--color-bg-subtle)">
                    <div className="mx-auto flex w-full max-w-360 flex-col gap-10 px-5 pt-24 pb-28 lg:px-35">
                        <div className="flex flex-col items-start gap-2.5 whitespace-nowrap">
                            <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-pink)">{'// recommended'}</p>
                            <h2 className="flex items-baseline gap-4">
                                <span className="font-display text-[36px] leading-[1.2] font-medium tracking-[-0.36px] text-(--color-text-primary)">You might like</span>
                                <span className="font-plex text-xs leading-normal font-medium tracking-[0.72px] text-(--color-text-secondary)">こちらの記事はいかがですか？</span>
                            </h2>
                        </div>
                        <PostGrid posts={recommendedPosts} />
                    </div>
                </section>
            )}
        </div>
    );
}
