import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

// 破棄を許可するキャッシュタグ
const ALLOWED_TAGS = ['posts', 'menu'];

type RevalidateBody = {
    tags?: string[];
    slug?: string; // 記事のスラッグ（指定時はそのページも破棄）
};

// WordPress の更新時に呼ばれ、Next.js 側のキャッシュを破棄する
export async function POST(request: NextRequest) {
    const secret = process.env.REVALIDATE_SECRET;
    if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    const body: RevalidateBody = await request.json().catch(() => ({}));
    const tags = (body.tags ?? ['posts']).filter((tag) => ALLOWED_TAGS.includes(tag));

    // 次のアクセスで必ず最新を取得させる（古いキャッシュは返さない）
    tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));

    // 公開前にアクセスされた 404 が残らないよう、記事ページ自体も破棄する
    if (body.slug) {
        revalidatePath(`/posts/${body.slug}`);
    }

    return NextResponse.json({ revalidated: true, tags, slug: body.slug ?? null, now: Date.now() });
}
