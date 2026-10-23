
import Link from "next/link";

type Props = { title: string };

export default function Breadcrumbs({ title }: Props) {
    return (
        <nav aria-label="パンくず">
            <Link href="/">ホーム</Link>
            {" > "}
            <Link href="/posts">記事一覧</Link>
            {" > "}
            <span>{title}</span>
        </nav>
    );
}