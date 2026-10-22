"use cache";
import { client } from "@/lib/graphql";
import { gql } from "graphql-request";
import parse from 'html-react-parser'
import { cacheLife, cacheTag } from "next/cache";

cacheLife("hours");
cacheTag("menu");

export default async function PostPage({

    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const query = gql`
		query Post($slug: ID!) { 
			post(id: $slug, idType: SLUG) { 
				title
	      content
	    }  
	  } 
	`;

    const data = await client.request(query, { slug });
    const post = data.post;

    return (
        <article>
            <h1>{post.title}</h1>
            <div>{parse(post.content)}</div>
        </article>
    );
}

export async function generateStaticParams() {
    const query = gql`
		query Slugs { 
			posts { 
				nodes { 
					slug
				} 
			} 
		}
	`;

    const data = await client.request(query);

    return data.posts.nodes.map((p: any) => ({ slug: p.slug }));
}
