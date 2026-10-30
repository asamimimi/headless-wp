"use cache";
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cacheLife, cacheTag } from "next/cache";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { PostGrid, formatDate, readingMinutes } from '@/app/components/PostCard';
import ArticleBody from '@/app/components/article/ArticleBody';
import ShareButtons from '@/app/components/article/ShareButtons';
import Sidebar from '@/app/components/article/Sidebar';
import { extractHeadings } from '@/app/components/article/headings';
import { client } from "@/lib/graphql";
import { gql } from "graphql-request";
import { fetchAdjacentPosts, fetchPostBySlug, fetchPostsByCategory, type PostDetail, type PostLink } from '@/lib/blogApi';

// タグチップ
const TagChip = ({ name }: { name: string }) => (
    <li className="rounded-full bg-(--color-bg-subtle) px-3 py-1.25 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-accent-primary-strong)">
        #{name}
    </li>
);

// 記事ヘッダー（カテゴリー・タイトル・著者・日付・タグ）
const ArticleHead = ({ post }: { post: PostDetail }) => {
    const category = post.categories.nodes[0];
    const author = post.author?.node;

    return (
        <header className="flex flex-col items-start gap-5">
            {category && (
                <Link href={`/category/${category.slug}`} className="flex items-center gap-1.5 font-mono text-xs leading-[1.4] font-medium tracking-[1.2px] text-(--color-accent-pink) uppercase">
                    <Image src="/Article/dot.svg" alt="" width={6} height={6} />
                    {category.name}
                </Link>
            )}
            <h1 className="font-plex text-[28px] leading-normal font-bold tracking-[0.68px] text-(--color-text-primary) lg:text-[34px]">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] whitespace-nowrap text-(--color-text-secondary)">
                {author && (
                    <div className="flex items-center gap-2.5">
                        <Avatar name={author.name} url={author.avatar?.url} size={32} />
                        <span className="font-plex text-[13px] leading-[1.7] font-semibold tracking-[0.39px] text-(--color-text-primary)">{author.name}</span>
                    </div>
                )}
                <time dateTime={post.date}>Published {formatDate(post.date)}</time>
                {post.modified.slice(0, 10) !== post.date.slice(0, 10) && (
                    <time dateTime={post.modified}>Updated {formatDate(post.modified)}</time>
                )}
                <span>{readingMinutes(post.content)} min read</span>
            </div>
            {post.tags.nodes.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                    {post.tags.nodes.map((tag) => <TagChip key={tag.id} name={tag.name} />)}
                </ul>
            )}
        </header>
    );
};

// アイキャッチ（未設定時はプレースホルダー）
const ArticleThumbnail = ({ post }: { post: PostDetail }) => {
    const imageUrl = post.featuredImage?.node?.sourceUrl;

    return (
        <div className="relative flex aspect-760/420 items-center justify-center overflow-hidden rounded-3xl bg-[linear-gradient(160.1deg,#221e48_0%,#3b2c8a_35.714%,#7b4fc9_71.429%)]">
            {imageUrl ? (
                <Image src={imageUrl} alt={post.featuredImage?.node?.altText ?? ''} fill priority sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
            ) : (
                <>
                    <Image src="/Article/thumbnail-grid.svg" alt="" fill />
                    <div className="absolute inset-[-30%_-16.67%_20%_55.56%]">
                        <div className="absolute inset-[-12.99%_-8.46%]">
                            <Image src="/Article/glow.svg" alt="" fill />
                        </div>
                    </div>
                    <p className="relative px-10 text-center font-display text-[28px] leading-[1.2] font-medium tracking-[-0.4px] text-white opacity-85 lg:text-[40px]">
                        {post.title}
                    </p>
                </>
            )}
        </div>
    );
};

// 著者アバター（グラデーションの枠付き）
const Avatar = ({ name, url, size }: { name: string; url?: string; size: number }) => (
    <div
        className="relative shrink-0 overflow-hidden rounded-full bg-[linear-gradient(135deg,#e6e0ff_0%,#f3ddf6_35.714%,#ffe1ee_71.429%)]"
        style={{ width: size, height: size }}
    >
        {url ? (
            <Image src={url} alt={name} fill sizes={`${size}px`} unoptimized className="object-cover" />
        ) : (
            <>
                <Image src="/Article/author-thumbnail-grid.svg" alt="" fill />
                <div className="absolute inset-[-30%_-16.67%_20%_55.56%]">
                    <div className="absolute inset-[-66.52%_-119.73%]">
                        <Image src="/Article/author-glow.svg" alt="" fill />
                    </div>
                </div>
            </>
        )}
    </div>
);

// 著者ボックス
const AuthorBox = ({ author }: { author: NonNullable<PostDetail['author']>['node'] }) => (
    <div className="flex flex-col gap-6 rounded-3xl border border-(--color-border-default) bg-(--color-bg-surface) p-8 sm:flex-row sm:items-start">
        <div className="shrink-0 rounded-full bg-[linear-gradient(135deg,#7b61ff_0%,#c46bff_35.714%,#ff8cc6_71.429%)] p-0.75">
            <Avatar name={author.name} url={author.avatar?.url} size={82} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-pink)">{'// written by'}</p>
            <p className="font-plex text-lg leading-[1.6] font-semibold tracking-[0.36px] text-(--color-text-primary)">{author.name}</p>
            {author.description && (
                <p className="font-plex text-[13px] leading-[1.7] tracking-[0.39px] text-(--color-text-secondary)">{author.description}</p>
            )}
        </div>
    </div>
);

// 前後の記事
const PrevNext = ({ prev, next }: { prev: PostLink | null; next: PostLink | null }) => {
    const cardClass = 'flex flex-1 flex-col gap-2 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) px-6 py-5 transition-colors hover:border-(--color-accent-primary)';
    const labelClass = 'font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-accent-primary)';
    const titleClass = 'font-plex text-[13px] leading-[1.7] tracking-[0.39px] text-(--color-text-primary)';

    return (
        <nav aria-label="前後の記事" className="flex flex-col gap-5 sm:flex-row">
            {prev ? (
                <Link href={`/posts/${prev.slug}`} className={cardClass}>
                    <span className={labelClass}>← prev</span>
                    <span className={titleClass}>{prev.title}</span>
                </Link>
            ) : <div className="hidden flex-1 sm:block" />}
            {next ? (
                <Link href={`/posts/${next.slug}`} className={`${cardClass} items-end text-right`}>
                    <span className={labelClass}>next →</span>
                    <span className={titleClass}>{next.title}</span>
                </Link>
            ) : <div className="hidden flex-1 sm:block" />}
        </nav>
    );
};

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    cacheLife("hours");
    cacheTag("menu");

    const post = await fetchPostBySlug(slug);
    if (!post) notFound();

    const category = post.categories.nodes[0];
    const [{ prev, next }, categoryPosts] = await Promise.all([
        fetchAdjacentPosts(slug),
        category ? fetchPostsByCategory(category.slug, 4) : Promise.resolve([]),
    ]);
    const relatedPosts = categoryPosts.filter((related) => related.slug !== slug).slice(0, 3);
    const { html, headings } = extractHeadings(post.content ?? '');

    return (
        <div>
            <div className="mx-auto w-full max-w-360 px-5 pt-7 lg:px-35">
                <Breadcrumbs currentLabel={post.title} />
            </div>

            <div className="mx-auto flex w-full max-w-360 flex-col gap-20 px-5 pt-10 pb-28 lg:flex-row lg:items-start lg:px-35">
                <article className="flex min-w-0 flex-1 flex-col gap-8 lg:max-w-190">
                    <ArticleHead post={post} />
                    <ArticleThumbnail post={post} />
                    <ArticleBody html={html} headings={headings} />
                    <ShareButtons title={post.title} />
                    {post.author?.node && <AuthorBox author={post.author.node} />}
                    <PrevNext prev={prev} next={next} />
                </article>

                <Sidebar headings={headings} />
            </div>

            {relatedPosts.length > 0 && (
                <section className="bg-(--color-bg-subtle)">
                    <div className="mx-auto flex w-full max-w-360 flex-col gap-10 px-5 pt-24 pb-28 lg:px-35">
                        <div className="flex flex-col items-start gap-2.5 whitespace-nowrap">
                            <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-pink)">{'// related'}</p>
                            <h2 className="flex items-baseline gap-4">
                                <span className="font-display text-[36px] leading-[1.2] font-medium tracking-[-0.36px] text-(--color-text-primary)">Related Articles</span>
                                <span className="font-plex text-xs leading-normal font-medium tracking-[0.72px] text-(--color-text-secondary)">あわせて読みたい</span>
                            </h2>
                        </div>
                        <PostGrid posts={relatedPosts} />
                    </div>
                </section>
            )}
        </div>
    );
}

export async function generateStaticParams() {
    const query = gql`
		query Slugs {
			posts {
				nodes {
					slug
				}
			}
		}
	`;

    const data = await client.request<{ posts: { nodes: { slug: string }[] } }>(query);

    return data.posts.nodes.map((p) => ({ slug: p.slug }));
}
