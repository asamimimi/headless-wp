import { fetchPostsByCategory } from '@/lib/blogApi';
import Link from 'next/link';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const posts = await fetchPostsByCategory(slug, 10);

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">カテゴリー: {slug}</h1>
            <div className="grid gap-4">
                {posts.map((post: any) => (
                    <article key={post.databaseId} className="border p-4 rounded">
                        <Link href={`/posts/${post.slug}`}>
                            <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
                        </Link>
                        <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
                    </article>
                ))}
            </div>
        </main>
    );
}
