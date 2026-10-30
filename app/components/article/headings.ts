export type Heading = { id: string; text: string };

/**
 * 本文の h2 に id を振り、目次用の見出し一覧を返す
 * text はタグを除去した HTML（実体参照は parse 時にデコードされる）
 */
export function extractHeadings(html: string): { html: string; headings: Heading[] } {
    const headings: Heading[] = [];

    const replaced = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_, attrs: string, inner: string) => {
        const id = `section-${headings.length + 1}`;
        headings.push({ id, text: inner.replace(/<[^>]*>/g, '').trim() });
        return `<h2${attrs.replace(/\s+id="[^"]*"/, '')} id="${id}">${inner}</h2>`;
    });

    return { html: replaced, headings };
}
