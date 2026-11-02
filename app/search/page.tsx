import { Suspense } from 'react';
import Form from 'next/form';
import Image from 'next/image';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { PostGrid } from '@/app/components/PostCard';
import { searchPosts } from '@/lib/blogApi';

interface SearchPageProps {
    searchParams: Promise<{ q?: string | string[] }>;
}

// searchParams を読むためリクエスト時に描画する
async function SearchResults({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const keyword = (Array.isArray(q) ? q[0] : q ?? '').trim();
    const posts = keyword ? await searchPosts(keyword) : [];

    return (
        <>
            {/* 検索フォーム */}
            <Form action="/search" role="search" className="flex w-full max-w-160 items-center gap-3 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) py-2 pr-2 pl-4 focus-within:border-(--color-accent-primary)">
                <Image src="/Top/Header/icon-search.svg" alt="" width={18} height={18} />
                <input
                    type="search"
                    name="q"
                    defaultValue={keyword}
                    placeholder="キーワードで記事を検索"
                    aria-label="検索キーワード"
                    className="min-w-0 flex-1 bg-transparent font-plex text-sm leading-normal text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary)"
                />
                <button
                    type="submit"
                    className="rounded-xl bg-(--color-accent-primary) px-5 py-2.5 font-plex text-sm leading-normal font-semibold tracking-[0.84px] text-white transition-opacity hover:opacity-90"
                >
                    検索
                </button>
            </Form>

            {keyword ? (
                <>
                    <p className="font-plex text-sm leading-normal text-(--color-text-secondary)">
                        「<span className="font-semibold text-(--color-text-primary)">{keyword}</span>」の検索結果：{posts.length}件
                    </p>
                    {posts.length > 0 ? (
                        <PostGrid posts={posts} />
                    ) : (
                        <p className="py-16 text-center font-plex text-sm leading-normal text-(--color-text-secondary)">
                            該当する記事が見つかりませんでした。別のキーワードでお試しください。
                        </p>
                    )}
                </>
            ) : (
                <p className="font-plex text-sm leading-normal text-(--color-text-secondary)">キーワードを入力してください。</p>
            )}
        </>
    );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
    return (
        <div>
            <Breadcrumbs />
            <section className="mx-auto flex w-full max-w-360 flex-col gap-12 px-5 pt-16 pb-20 lg:px-35 lg:pt-24 lg:pb-28">
                {/* セクションタイトル */}
                <div className="flex flex-col items-start gap-2.5 whitespace-nowrap">
                    <h1 className="flex items-baseline gap-4">
                        <span className="font-display text-[36px] leading-[1.2] font-medium tracking-[-0.36px] text-(--color-text-primary)">Search</span>
                        <span className="font-plex text-xs leading-normal font-medium tracking-[0.72px] text-(--color-text-secondary)">検索結果</span>
                    </h1>
                </div>

                <Suspense fallback={<p className="font-plex text-sm text-(--color-text-secondary)">検索中...</p>}>
                    <SearchResults searchParams={searchParams} />
                </Suspense>
            </section>
        </div>
    );
}
