import Link from 'next/link';
import Image from 'next/image';
import { fetchSidebarData } from '@/lib/blogApi';
import SidebarToc from './SidebarToc';
import type { Heading } from './headings';

// ウィジェット見出し
const WidgetTitle = ({ english, japanese }: { english: string; japanese: string }) => (
    <h2 className="flex items-baseline gap-2.5 border-b border-(--color-border-default) pb-3.5 whitespace-nowrap">
        <span className="font-display text-[22px] leading-[1.2] font-medium tracking-[-0.22px] text-(--color-text-primary)">{english}</span>
        <span className="font-plex text-xs leading-normal font-medium tracking-[0.72px] text-(--color-text-secondary)">{japanese}</span>
    </h2>
);

const Sidebar = async ({ headings }: { headings: Heading[] }) => {
    const { popularPosts, tags } = await fetchSidebarData();

    return (
        <aside className="flex w-full shrink-0 flex-col gap-12 lg:w-80">
            {/* 検索機能は未実装のため見た目のみ */}
            <div className="flex items-center gap-2.5 rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) py-3 pr-3 pl-4">
                <Image src="/Article/icon-search.svg" alt="" width={18} height={18} />
                <p className="flex-1 font-plex text-[13px] leading-[1.7] tracking-[0.39px] text-(--color-text-secondary)">キーワードで記事を検索</p>
                <kbd className="rounded bg-(--color-bg-subtle) px-1.5 py-0.5 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-secondary)">⌘K</kbd>
            </div>

            {headings.length > 0 && <SidebarToc headings={headings} />}

            <section className="flex flex-col gap-5">
                <WidgetTitle english="Popular" japanese="よく読まれている記事" />
                <ol className="flex flex-col gap-5">
                    {popularPosts.map((post, index) => {
                        const category = post.categories.nodes[0];
                        const imageUrl = post.featuredImage?.node?.sourceUrl;
                        const imageAlt = post.featuredImage?.node?.altText ?? '';

                        return (
                            <li key={post.id}>
                                <Link href={`/posts/${post.slug}`} className="group flex items-center gap-4">
                                    <span className="font-display text-[28px] leading-[1.2] font-light tracking-[-0.28px] text-(--color-accent-primary)">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                        {category && (
                                            <p className="flex items-center gap-1.5 font-mono text-xs leading-[1.4] font-medium tracking-[1.2px] whitespace-nowrap text-(--color-accent-pink) uppercase">
                                                <Image src="/Article/dot.svg" alt="" width={6} height={6} />
                                                {category.name}
                                            </p>
                                        )}
                                        <h3 className="font-plex text-[13px] leading-[1.7] font-semibold tracking-[0.39px] text-(--color-text-primary) group-hover:text-(--color-accent-primary-strong)">
                                            {post.title}
                                        </h3>
                                    </div>
                                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(141.34deg,#e6e0ff_0%,#f3ddf6_35.714%,#ffe1ee_71.429%)]">
                                        {imageUrl ? (
                                            <Image src={imageUrl} alt={imageAlt} fill sizes="80px" className="object-cover" />
                                        ) : (
                                            <>
                                                <Image src="/Article/sidebar-thumb-grid.svg" alt="" fill />
                                                <div className="absolute inset-[-30%_-16.67%_20%_55.56%]">
                                                    <div className="absolute inset-[-85.23%_-122.73%]">
                                                        <Image src="/Article/sidebar-glow.svg" alt="" fill />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            </section>

            {tags.length > 0 && (
                <section className="flex flex-col gap-5">
                    <WidgetTitle english="Tags" japanese="タグ" />
                    <ul className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <li key={tag.id} className="rounded-full bg-(--color-bg-subtle) px-3 py-1.25 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-accent-primary-strong)">
                                #{tag.name}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </aside>
    );
};

export default Sidebar;
