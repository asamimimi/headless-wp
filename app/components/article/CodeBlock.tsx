"use client";
import Image from 'next/image';
import { useState } from 'react';

type CodeBlockProps = {
    code: string;
    fileName?: string;
};

// コードブロック（ウィンドウ風のバー + コピーボタン）
const CodeBlock = ({ code, fileName }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col overflow-hidden rounded-3xl bg-(--color-code-bg)">
            <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3.5">
                <Image src="/Article/code-dot-1.svg" alt="" width={10} height={10} />
                <Image src="/Article/code-dot-2.svg" alt="" width={10} height={10} />
                <Image src="/Article/code-dot-3.svg" alt="" width={10} height={10} />
                {fileName && (
                    <p className="font-mono text-[13px] leading-normal tracking-[0.26px] text-(--color-code-comment)">{fileName}</p>
                )}
                <button
                    type="button"
                    onClick={handleCopy}
                    className="ml-auto font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-code-comment) transition-colors hover:text-(--color-code-text)"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="overflow-x-auto px-6 pt-5 pb-6 font-mono text-sm leading-[1.8] text-(--color-code-text)">
                <code>{code}</code>
            </pre>
        </div>
    );
};

export default CodeBlock;
