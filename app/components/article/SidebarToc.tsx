"use client";
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import type { Heading } from './headings';

// サイドバーの目次（表示中の見出しをハイライト）
const SidebarToc = ({ headings }: { headings: Heading[] }) => {
    const [activeId, setActiveId] = useState(headings[0]?.id);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) setActiveId(visible.target.id);
            },
            { rootMargin: '-100px 0px -70% 0px' },
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    return (
        <nav aria-label="目次" className="flex flex-col gap-1 rounded-[20px] border border-(--color-border-default) bg-(--color-bg-surface) p-6">
            <p className="font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-secondary)">ON THIS PAGE</p>
            <ul className="flex flex-col">
                {headings.map(({ id, text }) => {
                    const isActive = id === activeId;
                    return (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                className={`block border-l-2 py-2 pl-3 font-plex text-[13px] leading-[1.7] tracking-[0.39px] transition-colors ${isActive
                                    ? 'border-(--color-accent-primary) font-semibold text-(--color-accent-primary-strong)'
                                    : 'border-(--color-border-default) text-(--color-text-secondary) hover:text-(--color-text-primary)'
                                    }`}
                            >
                                {parse(text)}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default SidebarToc;
