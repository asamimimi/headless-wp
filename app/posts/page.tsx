import Link from 'next/link';
import Image from 'next/image';
import { endpoint } from "@/lib/graphql";
import { cacheLife, cacheTag } from "next/cache";
import Breadcrumbs from '../components/Breadcrumbs';
import CategoryTabs from '../components/top/CategoryTabs';
import { PostGrid } from '../components/PostCard';
import { POST_FIELDS, type Post } from '@/lib/blogApi';

type Category = {
    id: string;
    name: string;
    slug: string;
    posts: { nodes: Post[] };
};


// GraphQLクエリの定義（最新の投稿を取得）
const GET_LATEST_POSTS_QUERY = `
  query GetLatestPosts {
    posts( where: { orderby: { field: DATE, order: DESC } }) {
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
            revalidate: 3600,
            tags: ['posts']
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch WordPress data');
    }

    const { data } = await res.json();
    return data.categories.nodes;
}
const Articles = async () => {

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
        <div>
            <Breadcrumbs />
            <section className="mx-auto flex w-full max-w-360 flex-col gap-12 px-5 pt-16 pb-20 lg:px-35 lg:pt-24 lg:pb-28">
                <CategoryTabs
                    tabs={tabs}
                    panels={panels}
                    heading={
                        /* セクションタイトル */
                        <div className="flex flex-col items-start gap-2.5 whitespace-nowrap">

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

        </div>
    )
}

export default Articles