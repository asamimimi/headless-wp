import parse, { domToReact, Element, Text, type DOMNode, type HTMLReactParserOptions } from 'html-react-parser';
import CodeBlock from './CodeBlock';
import type { Heading } from './headings';

// 要素内のテキストをすべて連結
const getText = (nodes: DOMNode[]): string =>
    nodes.map((node) => {
        if (node instanceof Text) return node.data;
        if (node instanceof Element) return getText(node.children as DOMNode[]);
        return '';
    }).join('');

// コールアウトの種類（WP の引用ブロックのスタイル名で切り替え）
const calloutStyles = {
    note: { label: 'NOTE', className: 'border-(--color-accent-primary) bg-[#f0edff] text-(--color-accent-primary)' },
    tip: { label: 'TIP', className: 'border-(--color-accent-mint) bg-[#e9f8f3] text-(--color-accent-mint)' },
    warning: { label: 'WARNING', className: 'border-(--color-accent-pink) bg-[#fceef5] text-(--color-accent-pink)' },
};

const getCalloutType = (className = ''): keyof typeof calloutStyles => {
    if (className.includes('tip')) return 'tip';
    if (className.includes('warning')) return 'warning';
    return 'note';
};

// 本文中の目次
const ContentsBox = ({ headings }: { headings: Heading[] }) => (
    <nav aria-label="目次" className="flex flex-col gap-3.5 rounded-[20px] bg-(--color-bg-subtle) px-8 py-7">
        <p className="flex items-baseline gap-2.5">
            <span className="font-display text-xl leading-[1.2] font-medium tracking-[-0.2px] text-(--color-text-primary)">Contents</span>
            <span className="font-plex text-xs leading-normal font-medium tracking-[0.72px] text-(--color-text-secondary)">目次</span>
        </p>
        <ol className="flex flex-col gap-3.5">
            {headings.map(({ id, text }, index) => (
                <li key={id}>
                    <a href={`#${id}`} className="group flex items-center gap-3.5">
                        <span className="font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-accent-primary)">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-plex text-[15px] leading-[1.9] tracking-[0.45px] text-(--color-text-primary) group-hover:text-(--color-accent-primary-strong)">
                            {parse(text)}
                        </span>
                    </a>
                </li>
            ))}
        </ol>
    </nav>
);

const ArticleBody = ({ html, headings }: { html: string; headings: Heading[] }) => {
    const options: HTMLReactParserOptions = {
        replace(node) {
            if (!(node instanceof Element)) return;
            const children = node.children as DOMNode[];

            // h2: 番号付き見出し（最初の h2 の直前に目次を差し込む）
            if (node.name === 'h2') {
                const index = headings.findIndex((heading) => heading.id === node.attribs.id);
                const heading = (
                    <h2 id={node.attribs.id} className="flex scroll-mt-28 flex-col gap-2.5 border-b border-(--color-border-default) pt-6 pb-2.5">
                        <span className="flex items-center gap-3.5">
                            <span className="rounded-md bg-[linear-gradient(145.89deg,#7b61ff_0%,#c46bff_35.714%,#ff8cc6_71.429%)] px-2 py-0.5 font-mono text-xs leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-inverse)">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="font-plex text-2xl leading-normal font-bold tracking-[0.48px] text-(--color-text-primary)">
                                {domToReact(children, options)}
                            </span>
                        </span>
                    </h2>
                );
                return index === 0 && headings.length > 0 ? <><ContentsBox headings={headings} />{heading}</> : heading;
            }

            // pre: コードブロック
            if (node.name === 'pre') {
                const code = children.find((child): child is Element => child instanceof Element && child.name === 'code');
                const language = code?.attribs.class?.match(/language-(\S+)/)?.[1];
                return <CodeBlock code={getText(children)} fileName={node.attribs['data-filename'] ?? language} />;
            }

            // blockquote: コールアウト
            if (node.name === 'blockquote') {
                const { label, className } = calloutStyles[getCalloutType(node.attribs.class)];
                return (
                    <aside className={`flex gap-4 rounded-xl border-l-3 px-6 py-5 ${className}`}>
                        <p className="shrink-0 font-mono text-xs leading-[1.4] font-medium tracking-[1.2px]">{label}</p>
                        <div className="article-callout min-w-0 flex-1 font-plex text-[15px] leading-[1.9] tracking-[0.45px] text-(--color-text-primary)">
                            {domToReact(children, options)}
                        </div>
                    </aside>
                );
            }
        },
    };

    return <div className="article-body">{parse(html, options)}</div>;
};

export default ArticleBody;
