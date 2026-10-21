import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

const gradient = 'bg-[linear-gradient(165deg,#7b61ff_0%,#c46bff_35.714%,#ff8cc6_71.429%)]';

// 実績の数値(WordPress連携までは固定値)
const stats = [
    { value: '128', label: 'articles' },
    { value: '12', label: 'series' },
    { value: '2021', label: 'since' },
];

const Mv = () => {
    return (
        <section className="mx-auto flex w-full max-w-360 flex-col items-center gap-18 px-5 pt-16 pb-20 lg:flex-row lg:px-35 lg:pt-24 lg:pb-28">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-7">
                <p className="flex items-center gap-2 rounded-full border border-(--color-accent-primary-soft) bg-(--color-bg-surface) py-1.5 pr-3.5 pl-3 font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-primary-strong)">
                    <Image src="/Top/Mv/ellipse.svg" alt="" width={8} height={8} />
                    <span>{`console.log("hello, world")`}</span>
                </p>

                <h2 className="font-display text-[40px] leading-[1.08] font-light tracking-[-0.02em] text-(--color-text-primary) md:text-[68px]">
                    Code with{' '}
                    <span className="bg-linear-to-r from-[#7b61ff] via-[#c46bff] to-[#ff8cc6] bg-clip-text font-normal text-transparent">grace</span>,
                    <br />
                    build the future.
                </h2>

                <p className="font-plex text-base leading-loose tracking-[0.48px] text-(--color-text-secondary)">
                    やさしく、確かに、未来をつくる。
                    <br />
                    女性エンジニアが綴る、Web とクラウドと AI の技術ノート。
                </p>

                <div className="flex flex-wrap gap-4">
                    <Link
                        href="#latest"
                        className={`flex items-center gap-2.5 rounded-full py-3.5 pr-6 pl-7 font-plex text-sm leading-normal font-semibold tracking-[0.84px] text-(--color-text-inverse) drop-shadow-[0px_16px_20px_rgba(92,64,224,0.1)] transition-opacity hover:opacity-85 ${gradient}`}
                    >
                        最新の記事を読む
                        <Image src="/Top/Mv/icon-arrow-white.svg" alt="" width={16} height={16} />
                    </Link>
                    <Link
                        href="/about"
                        className="flex items-center gap-2.5 rounded-full border border-(--color-border-default) bg-(--color-bg-surface) py-3.5 pr-6 pl-7 font-plex text-sm leading-normal font-semibold tracking-[0.84px] text-(--color-text-primary) transition-colors hover:border-(--color-accent-primary)"
                    >
                        About me
                        <Image src="/Top/Mv/icon-arrow.svg" alt="" width={16} height={16} />
                    </Link>
                </div>

                <dl className="flex gap-10 pt-3 whitespace-nowrap">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col-reverse gap-0.5">
                            <dt className="font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-secondary)">{stat.label}</dt>
                            <dd className="font-display text-[30px] leading-[1.2] tracking-[-0.3px] text-(--color-text-primary)">{stat.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* 注目シリーズ(サムネイルは WP のアイキャッチに差し替え予定) */}
            <article className="flex w-full max-w-125 shrink-0 flex-col gap-5 overflow-hidden rounded-[28px] border border-white bg-white/70 px-5 pt-5 pb-7 shadow-[0px_16px_40px_0px_rgba(92,64,224,0.1)] backdrop-blur-md">
                <div className="relative flex h-65 items-center justify-center overflow-hidden rounded-[18px] bg-[linear-gradient(150deg,#221e48_0%,#3b2c8a_35.714%,#7b4fc9_71.429%)]">
                    <Image src="/Top/Mv/thumbnail-grid.svg" alt="" fill className="object-cover" />
                    <div className="absolute inset-[-30%_-16.67%_20%_55.56%]">
                        <div className="absolute inset-[-20.98%_-21.44%]">
                            <Image src="/Top/Mv/glow.svg" alt="" fill />
                        </div>
                    </div>
                    <p className="relative font-display text-[30px] leading-[1.2] font-medium tracking-[-0.3px] whitespace-nowrap text-white opacity-85">
                        Headless WP ✦ Next.js
                    </p>
                </div>

                <div className="flex flex-col gap-3 px-2">
                    <div className="flex items-center gap-3 font-mono text-xs leading-[1.4] font-medium whitespace-nowrap">
                        <span className={`rounded-full px-2.5 py-0.75 tracking-[0.48px] text-(--color-text-inverse) ${gradient}`}>FEATURED</span>
                        <span className="flex items-center gap-1.5 tracking-[1.2px] text-(--color-accent-pink)">
                            <Image src="/Top/Mv/dot.svg" alt="" width={6} height={6} />
                            SERIES 01
                        </span>
                    </div>
                    <h3 className="font-plex text-[21px] leading-normal font-bold tracking-[0.42px] text-(--color-text-primary)">
                        ゼロから始めるヘッドレス WordPress
                        <br />
                        — 設計・実装・運用まで全10回
                    </h3>
                    <div className="flex items-center gap-3">
                        <div
                            role="progressbar"
                            aria-label="シリーズの進捗"
                            aria-valuemin={0}
                            aria-valuemax={10}
                            aria-valuenow={7}
                            className="h-1.5 flex-1 overflow-hidden rounded-[3px] bg-(--color-bg-subtle)"
                        >
                            <div className={`h-full w-[70%] rounded-[3px] ${gradient}`} />
                        </div>
                        <p className="font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] whitespace-nowrap text-(--color-text-secondary)">7 / 10</p>
                    </div>
                </div>
            </article>
        </section>
    )
}

export default Mv
