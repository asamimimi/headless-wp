"use client";
import { useState } from 'react';

const buttonClass = 'rounded-full border border-(--color-border-default) bg-(--color-bg-surface) px-4 py-2 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-primary) transition-colors hover:border-(--color-accent-primary)';

// シェアボタン
const ShareButtons = ({ title }: { title: string }) => {
    const [copied, setCopied] = useState(false);

    const openShare = (buildUrl: (url: string, text: string) => string) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(title);
        window.open(buildUrl(url, text), '_blank', 'noopener,noreferrer');
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-wrap items-center gap-3 border-y border-(--color-border-default) py-6">
            <p className="font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-secondary)">Share</p>
            <button type="button" className={buttonClass} onClick={() => openShare((url, text) => `https://x.com/intent/post?url=${url}&text=${text}`)}>
                X
            </button>
            <button type="button" className={buttonClass} onClick={() => openShare((url, text) => `https://bsky.app/intent/compose?text=${text}%20${url}`)}>
                Bluesky
            </button>
            <button type="button" className={buttonClass} onClick={() => openShare((url) => `https://b.hatena.ne.jp/add?mode=confirm&url=${url}`)}>
                はてブ
            </button>
            <button type="button" className={buttonClass} onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy link'}
            </button>
        </div>
    );
};

export default ShareButtons;
