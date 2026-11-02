import Link from 'next/link';
import { endpoint } from "@/lib/graphql";
import { cacheLife, cacheTag } from "next/cache";

type TopicCategory = {
    id: string;
    name: string;
    slug: string;
    count: number | null;
};

// GraphQLクエリの定義（記事のあるカテゴリーと記事数を取得）
const GET_TOPICS_QUERY = `
  query GetTopics {
    categories(where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

// カードのアイコンと背景（カテゴリー順に繰り返す）
const icons = ['</>', '{ }', '☁', '✦', '♡'];
const iconGradients = [
    'bg-[linear-gradient(135deg,#e6e0ff_0%,#f3ddf6_35.714%,#ffe1ee_71.429%)]',
    'bg-[linear-gradient(135deg,#d7f3ea_0%,#e2e6ff_35.714%,#ece0ff_71.429%)]',
    'bg-[linear-gradient(135deg,#ffe6d9_0%,#fbddeb_35.714%,#ebddff_71.429%)]',
];

// カテゴリーの取得
async function getTopics(): Promise<TopicCategory[]> {
    "use cache";
    cacheLife("hours");
    cacheTag("posts");

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: GET_TOPICS_QUERY,
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch WordPress data');
    }

    const { data } = await res.json();
    return data.categories.nodes;
}

// カテゴリー一覧（SPのみ・横スクロール）
const Topics = async () => {
    const topics = await getTopics();

    return (
        <section className="flex flex-col gap-6 pt-4 pb-10 pl-5 lg:hidden">
            {/* セクションタイトル */}
            <div className="flex flex-col items-start gap-2.5 whitespace-nowrap">
                <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-accent-pink)">
                    {'// 01 — topics'}
                </p>
                <h2 className="flex items-baseline gap-4">
                    <span className="font-display text-[28px] leading-[1.2] font-medium tracking-[-0.28px] text-(--color-text-primary)">Explore Topics</span>
                    <span className="font-plex text-xs leading-normal font-medium tracking-[0.72px] text-(--color-text-secondary)">カテゴリー</span>
                </h2>
            </div>

            <ul className="flex gap-3 overflow-x-auto pr-5 [scrollbar-width:none]">
                {topics.map((topic, index) => (
                    <li key={topic.id} className="shrink-0">
                        <Link
                            href={`/category/${topic.slug}`}
                            className="flex w-33 flex-col items-start gap-2.5 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-4.5 transition-colors hover:border-(--color-accent-primary)"
                        >
                            <span className={`flex size-9 items-center justify-center rounded-[10px] font-mono text-sm leading-[1.4] font-medium tracking-[0.56px] text-(--color-accent-primary-strong) ${iconGradients[index % iconGradients.length]}`}>
                                {icons[index % icons.length]}
                            </span>
                            <span className="font-display text-lg leading-[1.2] font-medium tracking-[-0.18px] whitespace-nowrap text-(--color-text-primary)">
                                {topic.name}
                            </span>
                            <span className="font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] whitespace-nowrap text-(--color-text-secondary)">
                                {topic.count ?? 0} articles
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Topics
