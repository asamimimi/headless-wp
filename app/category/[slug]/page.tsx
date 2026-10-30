import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { PostGrid } from '@/app/components/PostCard';
import { fetchCategoryBySlug, fetchPostsByCategory } from '@/lib/blogApi';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const [category, posts] = await Promise.all([
        fetchCategoryBySlug(slug),
        fetchPostsByCategory(slug, 12),
    ]);
    const categoryName = category?.name ?? decodeURIComponent(slug);

    return (
        <div>
            <Breadcrumbs currentLabel={categoryName} />
            <section className="mx-auto flex w-full max-w-360 flex-col gap-12 px-5 pt-16 pb-20 lg:px-35 lg:pt-24 lg:pb-28">
                {/* セクションタイトル */}
                <div className="flex flex-col items-start gap-2.5 whitespace-nowrap">
                    <h1 className="flex items-baseline gap-4">
                        <span className="font-display text-[36px] leading-[1.2] font-medium tracking-[-0.36px] text-(--color-text-primary)">{categoryName}</span>
                        <span className="font-plex text-xs leading-normal font-medium tracking-[0.72px] text-(--color-text-secondary)">カテゴリー</span>
                    </h1>
                </div>

                <PostGrid posts={posts} />

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
    );
}
