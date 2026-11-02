import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

const gradient = 'bg-[linear-gradient(165deg,#7b61ff_0%,#c46bff_35.714%,#ff8cc6_71.429%)]';

// スキルタグ(WordPress連携までは固定値)
const skills = ['TypeScript', 'React', 'Next.js', 'WordPress', 'Figma'];

const About = () => {
    return (
        <section className="relative overflow-hidden bg-(--color-bg-deep)">
            {/* 背景のぼかし */}
            <Image
                src="/Top/About/ellipse.svg"
                alt=""
                width={880}
                height={780}
                className="pointer-events-none absolute -top-30 -left-60 max-w-none max-lg:hidden"
            />
            <Image
                src="/Top/About/aurora-sp.svg"
                alt=""
                width={520}
                height={480}
                className="pointer-events-none absolute -top-20 -left-40 max-w-none lg:hidden"
            />

            <div className="relative mx-auto flex w-full max-w-360 flex-col items-center gap-4.5 px-5 py-14 lg:flex-row lg:gap-20 lg:px-35 lg:py-28">
                {/* プロフィール画像 */}
                <div className={`shrink-0 overflow-hidden rounded-full p-0.75 lg:p-1 ${gradient}`}>
                    <div className="relative flex size-30 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#e6e0ff_0%,#f3ddf6_35.714%,#ffe1ee_71.429%)]">
                        <Image src="/Top/About/thumbnail-grid-sp.svg" alt="" fill className="lg:hidden" />
                        <Image src="/Top/About/thumbnail-grid.svg" alt="" fill className="max-lg:hidden" />
                        <div className="absolute inset-[-30%_-16.67%_20%_55.56%]">
                            <div className="absolute inset-[-45.45%_-81.82%] lg:hidden">
                                <Image src="/Top/About/glow-sp.svg" alt="" fill />
                            </div>
                            <div className="absolute inset-[-22.73%_-40.91%] max-lg:hidden">
                                <Image src="/Top/About/glow.svg" alt="" fill />
                            </div>
                        </div>
                        <p className="relative font-display text-[32px] leading-[1.2] font-medium tracking-[-0.32px] text-(--color-accent-primary) opacity-50">
                            Asami
                        </p>
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-center gap-4.5 text-center lg:items-start lg:gap-5 lg:text-left">
                    <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-primary-soft)">
                        {'// about me'}
                    </p>
                    <h2 className="font-plex text-xl leading-normal font-bold tracking-[0.4px] text-(--color-text-inverse) lg:text-[32px] lg:tracking-[0.64px]">
                        はじめまして、倉本あさみです。
                    </h2>
                    <p className="font-plex text-[13px] leading-[1.7] tracking-[0.39px] text-(--color-text-inverse) opacity-80 lg:text-base lg:leading-loose lg:tracking-[0.48px]">
                        2021年からweb制作の勉強を始め、その後WordPressの実装をメインにフリーランスとして活動を始めました。2026年にPHPの資格取得後、React・Next.jsの学習を始め、フロントエンド・エンジニアを目指す。
                    </p>
                    <ul className="flex flex-wrap gap-2 max-lg:hidden">
                        {skills.map((skill) => (
                            <li
                                key={skill}
                                className="rounded-full border border-white/16 bg-white/8 px-3 py-1.5 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-inverse)"
                            >
                                {skill}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/about"
                        className={`flex items-center gap-2.5 rounded-full py-3.5 pr-6 pl-7 font-plex text-sm leading-normal font-semibold tracking-[0.84px] text-(--color-text-inverse) drop-shadow-[0px_16px_20px_rgba(92,64,224,0.1)] transition-opacity hover:opacity-85 ${gradient}`}
                    >
                        プロフィールを見る
                        <Image src="/Top/Mv/icon-arrow-white.svg" alt="" width={16} height={16} />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default About
