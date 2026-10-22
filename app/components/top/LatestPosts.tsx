import Link from 'next/link';
import Image from 'next/image';
import { endpoint } from "@/lib/graphql";
import { cacheLife, cacheTag } from "next/cache";
import CategoryTabs from './CategoryTabs';


// サムネイル未設定時のプレースホルダー背景
const placeholderGradient = 'bg-[linear-gradient(150.8deg,#e6e0ff_0%,#f3ddf6_35.714%,#ffe1ee_71.429%)]';

type Post = {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    content: string;
    categories: { nodes: { id: string; name: string }[] };
    featuredImage: { node: { sourceUrl: string; altText: string } } | null;
    tags: { nodes: { id: string; name: string }[] };
};

type Category = {
    id: string;
    name: string;
    slug: string;
    posts: { nodes: Post[] };
};

// 記事カードで使う投稿のフィールド
const POST_FIELDS = `
  fragment PostFields on Post {
        id
        title
        slug
        date
        excerpt
        content
        categories {
            nodes {
                id
                name
            }
            }
        featuredImage {
        node {
          sourceUrl
          altText
        }
      }
        tags {
        nodes {
          id
          name
        }
      }
  }
`;

// GraphQLクエリの定義（最新6件の投稿を取得）
const GET_LATEST_POSTS_QUERY = `
  query GetLatestPosts {
    posts(first: 6, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        ...PostFields
      }
    }
  }
  ${POST_FIELDS}
`;


// カテゴリー取得（カテゴリーごとの最新6件の投稿も取得）
const GET_CTEGORIES = `
query GetCategories {
  categories {
    nodes {
      id
      name
      slug
      posts(first: 6, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          ...PostFields
        }
      }
    }
  }
  }
  ${POST_FIELDS}
`;

// HTMLタグを除去
const stripTags = (html = '') => html.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');

// 2026-10-18T00:00:00 → 2026.10.18
const formatDate = (date: string) => date.slice(0, 10).replaceAll('-', '.');

// 読了時間の目安(日本語 約500文字/分)
const readingMinutes = (html: string) => Math.max(1, Math.round(stripTags(html).length / 500));


// 最新の投稿取得
async function getLatestPosts(): Promise<Post[]> {
    "use cache";
    cacheLife("hours");
    cacheTag("menu");

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: GET_LATEST_POSTS_QUERY,
        }),

        next: {
            revalidate: 3600, // 3600秒（1時間）キャッシュ
            tags: ['posts']
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch WordPress data');
    }

    const { data } = await res.json();
    return data.posts.nodes;
}
// カテゴリーの取得
async function getCategiries(): Promise<Category[]> {
    "use cache";
    cacheLife("hours");
    cacheTag("menu");

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: GET_CTEGORIES,
        }),

        next: {
            revalidate: 3600, // 3600秒（1時間）キャッシュ
            tags: ['posts']
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch WordPress data');
    }

    const { data } = await res.json();
    return data.categories.nodes;
}

// 記事カード
const PostCard = ({ LatestPost }: { LatestPost: Post }) => {
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
const PostGrid = ({ posts }: { posts: Post[] }) => (
    posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post.id} LatestPost={post} />)}
        </div>
    ) : (
        <p className="py-10 text-center font-plex text-sm text-(--color-text-secondary)">このカテゴリーの記事はまだありません。</p>
    )
);

const LatestPosts = async () => {
    const LatestPosts = await getLatestPosts();
    const Ctegories = await getCategiries();

    const tabs = [
        { id: 'all', name: 'All' },
        ...Ctegories.map((category) => ({ id: category.id, name: category.name })),
    ];
    const panels = {
        all: <PostGrid posts={LatestPosts} />,
        ...Object.fromEntries(Ctegories.map((category) => [category.id, <PostGrid key={category.id} posts={category.posts.nodes} />])),
    };

    return (
        <section className="mx-auto flex w-full max-w-360 flex-col gap-12 px-5 pt-16 pb-20 lg:px-35 lg:pt-24 lg:pb-28">
            <CategoryTabs
                tabs={tabs}
                panels={panels}
                heading={
                    /* セクションタイトル */
                    <div className="flex flex-col items-start gap-2.5 whitespace-nowrap">
                        <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-pink)">
                            {'// 02 — latest'}
                        </p>
                        <h2 className="flex items-baseline gap-4">
                            <span className="font-display text-[36px] leading-[1.2] font-medium tracking-[-0.36px] text-(--color-text-primary)">Latest Articles</span>
                            <span className="font-plex text-xs leading-normal font-medium tracking-[0.72px] text-(--color-text-secondary)">新着記事</span>
                        </h2>
                    </div>
                }
            />

            <div className="flex justify-center">
                <Link
                    href="/posts"
                    className="flex items-center gap-2.5 rounded-full border border-(--color-border-default) bg-(--color-bg-surface) py-3.5 pr-6 pl-7 font-plex text-sm leading-normal font-semibold tracking-[0.84px] text-(--color-text-primary) transition-colors hover:border-(--color-accent-primary)"
                >
                    記事一覧を見る
                    <Image src="/Top/Mv/icon-arrow.svg" alt="" width={16} height={16} />
                </Link>
            </div>
        </section>
    )
}

export default LatestPosts
