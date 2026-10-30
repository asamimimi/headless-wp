import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/blogApi';

// サムネイル未設定時のプレースホルダー背景
const placeholderGradient = 'bg-[linear-gradient(150.8deg,#e6e0ff_0%,#f3ddf6_35.714%,#ffe1ee_71.429%)]';

// HTMLタグを除去
export const stripTags = (html = '') => html.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');

// 2026-10-18T00:00:00 → 2026.10.18
export const formatDate = (date: string) => date.slice(0, 10).replaceAll('-', '.');

// 読了時間の目安(日本語 約500文字/分)
export const readingMinutes = (html: string) => Math.max(1, Math.round(stripTags(html).length / 500));

// 記事カード
export const PostCard = ({ LatestPost }: { LatestPost: Post }) => {
    const imageUrl = LatestPost.featuredImage?.node?.sourceUrl;
    const imageAlt = LatestPost.featuredImage?.node?.altText ?? '';
    const category = LatestPost.categories.nodes[0];

    const excerpt = stripTags(LatestPost.excerpt);
    return (
        <article className="overflow-hidden rounded-3xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-[0px_16px_40px_0px_rgba(92,64,224,0.1)] transition-transform hover:-translate-y-1">
            <Link href={`/posts/${LatestPost.slug}`} className="flex h-full flex-col">
                <div className={`relative h-50 overflow-hidden ${imageUrl ? '' : placeholderGradient}`}>
                    {imageUrl ? (
                        <Image src={imageUrl} alt={imageAlt} fill sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                    ) : (
                        <>
                            <Image src="/Top/Mv/Thumbnail_Noimage.png" alt="noimage" fill />
                            <div className="absolute inset-[-30%_-16.67%_20%_55.56%]">
                                <div className="absolute inset-[-27.27%_-27.43%]">
                                    <Image src="/Top/LatestPosts/glow.svg" alt="" fill />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-3.5 p-6">
                    <div className="flex items-center justify-between font-mono text-xs leading-[1.4] font-medium whitespace-nowrap">
                        {category && (
                            <span className="flex items-center gap-1.5 tracking-[1.2px] text-(--color-accent-pink) uppercase">
                                <Image src="/Top/Mv/dot.svg" alt="" width={6} height={6} />
                                {category.name}
                            </span>
                        )}
                        <time dateTime={LatestPost.date} className="ml-auto tracking-[0.48px] text-(--color-text-secondary)">
                            {formatDate(LatestPost.date)}
                        </time>
                    </div>
                    <h3 className="font-plex text-lg leading-[1.6] font-semibold tracking-[0.36px] text-(--color-text-primary)">{LatestPost.title}</h3>
                    <p className="truncate font-plex text-[13px] leading-[1.7] tracking-[0.39px] text-(--color-text-secondary)">
                        {excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-2 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] whitespace-nowrap">
                        <ul className="flex min-w-0 flex-1 flex-wrap gap-2 overflow-hidden">
                            {LatestPost.tags.nodes.map((tag) => (

                                <li key={tag.id} className="rounded-full bg-(--color-bg-subtle) px-3 py-1.25 text-(--color-accent-primary-strong)">
                                    #{tag.name}
                                </li>
                            ))}
                        </ul>
                        <p className="text-(--color-text-secondary)">
                            {readingMinutes(LatestPost.content)} min read
                        </p>
                    </div>
                </div>
            </Link>
        </article>
    )
}

// 記事一覧のグリッド
export const PostGrid = ({ posts }: { posts: Post[] }) => (
    posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post.id} LatestPost={post} />)}
        </div>
    ) : (
        <p className="py-10 text-center font-plex text-sm text-(--color-text-secondary)">このカテゴリーの記事はまだありません。</p>
    )
);
