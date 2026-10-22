'use client';

import { useState, type ReactNode } from 'react';

type Tab = {
    id: string;
    name: string;
};

type Props = {
    tabs: Tab[];
    panels: Record<string, ReactNode>;
    heading: ReactNode;
};

// カテゴリーの切り替え(記事カードはサーバー側で描画済みのものを受け取る)
const CategoryTabs = ({ tabs, panels, heading }: Props) => {
    const [active, setActive] = useState(tabs[0]?.id);

    return (
        <>
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
                {heading}

                {/* カテゴリー一覧 */}
                <ul className="flex flex-wrap gap-2 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] whitespace-nowrap">
                    {tabs.map((tab) => {
                        const isActive = tab.id === active;
                        return (
                            <li key={tab.id}>
                                <button
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() => setActive(tab.id)}
                                    className={`block cursor-pointer rounded-full border px-3.5 py-1.75 transition-colors ${isActive
                                        ? 'border-(--color-text-primary) bg-(--color-text-primary) text-(--color-text-inverse)'
                                        : 'border-(--color-border-default) text-(--color-text-primary) hover:border-(--color-accent-primary)'
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* 新着記事 */}
            {active && panels[active]}
        </>
    );
};

export default CategoryTabs;
