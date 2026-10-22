import Link from 'next/link';
import Image from 'next/image';
import { endpoint } from "@/lib/graphql";
import { cacheLife, cacheTag } from "next/cache";


type PopularPostData = {
    id: string;
    title: string;
    slug: string;
    viewCount: number | null;
    categories: { nodes: { id: string; name: string }[] };
    featuredImage: { node: { sourceUrl: string; altText: string } } | null;
};

// GraphQLクエリの定義（6件の投稿を取得）
const GET_POPULAR_POSTS_QUERY = `
query GetPopularPosts {
  posts(first: 6, where: { orderby: [{ field: DATE, order: DESC }] }) {
    nodes {
      id
      title
      slug
      viewCount
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
    }

  }
}
`;

//人気記事の投稿取得
async function getPopularPosts(): Promise<PopularPostData[]> {
    "use cache";
    cacheLife("hours");
    cacheTag("menu");

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: GET_POPULAR_POSTS_QUERY,
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
const PopularPost = async () => {
    const popularPosts = await getPopularPosts();
    return (
        <section className="bg-(--color-bg-subtle)">
            <div className="mx-auto flex w-full max-w-360 flex-col gap-10 px-5 py-16 lg:px-35 lg:py-24">
                {/* セクションタイトル */}
                <div className="flex flex-col items-start gap-2.5 whitespace-nowrap">
                    <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-pink)">
                        {'// 03 — popular'}
                    </p>
                    <h2 className="flex items-baseline gap-4">
                        <span className="font-display text-[36px] leading-[1.2] font-medium tracking-[-0.36px] text-(--color-text-primary)">Popular</span>
                        <span className="font-plex text-xs leading-normal font-medium tracking-[0.72px] text-(--color-text-secondary)">よく読まれている記事</span>
                    </h2>
                </div>

                <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {popularPosts.map((popularPost, index) => {
                        const category = popularPost.categories.nodes[0];
                        const imageUrl = popularPost.featuredImage?.node?.sourceUrl;
                        const imageAlt = popularPost.featuredImage?.node?.altText ?? '';

                        return (
                            <li key={popularPost.id}>
                                <article className="h-full rounded-[20px] bg-(--color-bg-surface) transition-transform hover:-translate-y-1">
                                    <Link href={`/posts/${popularPost.slug}`} className="flex h-full items-center gap-4 p-5">
                                        <p className="font-display text-[28px] leading-[1.2] font-light tracking-[-0.28px] text-(--color-accent-primary)">
                                            {String(index + 1).padStart(2, '0')}
                                        </p>

                                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                            {category && (
                                                <p className="flex items-center gap-1.5 font-mono text-xs leading-[1.4] font-medium tracking-[1.2px] whitespace-nowrap text-(--color-accent-pink) uppercase">
                                                    <Image src="/Top/Mv/dot.svg" alt="" width={6} height={6} />
                                                    {category.name}
                                                </p>
                                            )}
                                            <h3 className="font-plex text-[13px] leading-[1.7] font-semibold tracking-[0.39px] text-(--color-text-primary)">
                                                {popularPost.title}
                                            </h3>
                                        </div>

                                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                                            {imageUrl ? (
                                                <Image src={imageUrl} alt={imageAlt} fill sizes="80px" className="object-cover" />
                                            ) : (
                                                <>
                                                    <Image src="/Top/Mv/Thumbnail_Noimage.png" alt="noimage" fill sizes="80px" className="object-cover" />
                                                    <div className="absolute inset-[-30%_-16.67%_20%_55.56%]">
                                                        <div className="absolute inset-[-85.23%_-122.73%]">
                                                            <Image src="/Top/PopularPost/glow.svg" alt="" fill />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </Link>
                                </article>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </section>
    )
}

export default PopularPost
