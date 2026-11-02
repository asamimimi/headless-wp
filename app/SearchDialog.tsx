'use client'

import { useEffect, useRef } from 'react';
import Form from 'next/form';
import Image from 'next/image';

// ヘッダーの検索ボタン（クリック or ⌘K / Ctrl+K で検索モーダルを開く）
const SearchDialog = () => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const open = () => {
        dialogRef.current?.showModal();
        inputRef.current?.focus();
    };
    const close = () => dialogRef.current?.close();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (dialogRef.current?.open) close();
                else open();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <>
            <button
                type="button"
                onClick={open}
                aria-haspopup="dialog"
                className="flex items-center gap-6 rounded-[10px] border border-(--color-border-default) bg-(--color-bg-surface) py-2 pr-3 pl-4 font-mono text-xs font-medium leading-[1.4] tracking-[0.48px] text-(--color-text-secondary) transition-colors hover:border-(--color-accent-primary)"
            >
                <Image src="/Top/Header/icon-search.svg" alt="" width={18} height={18} />
                <span>Search articles</span>
                <kbd className="rounded bg-(--color-bg-subtle) px-1.5 py-0.5 font-mono">⌘K</kbd>
            </button>

            <dialog
                ref={dialogRef}
                aria-label="記事を検索"
                // 背景（モーダルの外側）クリックで閉じる
                onClick={(e) => e.target === e.currentTarget && close()}
                className="mx-auto mt-[15vh] w-[calc(100%-32px)] max-w-160 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-0 shadow-[0px_16px_40px_0px_rgba(92,64,224,0.1)] backdrop:bg-black/30 backdrop:backdrop-blur-[2px]"
            >
                <Form action="/search" role="search" onSubmit={close} className="flex items-center gap-3 px-5 py-4">
                    <Image src="/Top/Header/icon-search.svg" alt="" width={20} height={20} />
                    <input
                        ref={inputRef}
                        type="search"
                        name="q"
                        required
                        placeholder="キーワードで記事を検索"
                        aria-label="検索キーワード"
                        className="min-w-0 flex-1 bg-transparent font-plex text-base leading-normal text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary)"
                    />
                    <kbd className="rounded bg-(--color-bg-subtle) px-1.5 py-0.5 font-mono text-xs text-(--color-text-secondary)">Esc</kbd>
                </Form>
            </dialog>
        </>
    );
}

export default SearchDialog
