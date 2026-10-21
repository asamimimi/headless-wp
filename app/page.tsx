import { client } from "@/lib/graphql";
import { gql } from "graphql-request";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import Mv from "./components/top/Mv";

type PostsResponse = {
  posts: { nodes: { title: string; slug: string }[] };
};

export default async function Home() {
  "use cache";
  cacheLife("minutes"); // 目安: 数分ごとに再検証
  cacheTag("posts");    // WordPress更新時のWebhookで破棄できる
  const query = gql`
		query AllPosts { 
			posts { 
				nodes { 
					title
					slug 
				}  
			}  
		} 
	`;

  const data = await client.request<PostsResponse>(query);
  const posts = data.posts.nodes;

  return (
    <main>
      <Mv />
      <h1 id="latest">Blog</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
