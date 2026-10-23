import { endpoint } from "@/lib/graphql";

const API_URL = endpoint;

export async function fetchPostsByCategory(categorySlug: string, first = 10) {
    const query = `
    query GetPostsByCategory($categoryName: String!, $first: Int) {
      posts(where: { categoryName: $categoryName }, first: $first) {
        nodes {
          databaseId
          title
          slug
          date
          excerpt
        }
      }
    }
  `;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: { categoryName: categorySlug, first },
        }),
        next: { revalidate: 60 }, // 必要に応じてISRなどのキャッシュ設定
    });

    const json = await response.json();
    return json.data?.posts?.nodes || [];
}
