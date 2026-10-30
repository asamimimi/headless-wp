import { endpoint } from "@/lib/graphql";

const API_URL = endpoint;

export type Post = {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    content: string;
    categories: { nodes: { id: string; name: string }[] };
    featuredImage: { node: { sourceUrl: string; altText: string } } | null;
    tags: { nodes: { id: string; name: string }[] };
};

// 記事カードで使う投稿のフィールド
export const POST_FIELDS = `
  fragment PostFields on Post {
        id
        title
        slug
        date
        excerpt
        content
        categories {
            nodes {
                id
                name
            }
            }
        featuredImage {
        node {
          sourceUrl
          altText
        }
      }
        tags {
        nodes {
          id
          name
        }
      }
  }
`;

export async function fetchPostsByCategory(categorySlug: string, first = 10): Promise<Post[]> {
    const query = `
    query GetPostsByCategory($categoryName: String!, $first: Int) {
      posts(where: { categoryName: $categoryName, orderby: { field: DATE, order: DESC } }, first: $first) {
        nodes {
          ...PostFields
        }
      }
    }
    ${POST_FIELDS}
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

export async function fetchCategoryBySlug(categorySlug: string) {
    const query = `
    query GetCategory($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        name
        slug
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
            variables: { slug: categorySlug },
        }),
        next: { revalidate: 60 },
    });

    const json = await response.json();
    return json.data?.category ?? null;
}

// GraphQL リクエストの共通処理
async function request<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 60 },
    });

    const json = await response.json();
    return json.data;
}

export type PostDetail = Omit<Post, 'categories' | 'tags'> & {
    modified: string;
    categories: { nodes: { id: string; name: string; slug: string }[] };
    tags: { nodes: { id: string; name: string; slug: string }[] };
    author: { node: { name: string; description: string | null; avatar: { url: string } | null } } | null;
};

export async function fetchPostBySlug(slug: string): Promise<PostDetail | null> {
    const query = `
    query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        slug
        date
        modified
        excerpt
        content
        categories { nodes { id name slug } }
        tags { nodes { id name slug } }
        featuredImage { node { sourceUrl altText } }
        author { node { name description avatar(size: 176) { url } } }
      }
    }
  `;

    const data = await request<{ post: PostDetail | null }>(query, { slug });
    return data?.post ?? null;
}

export type PostLink = { slug: string; title: string };

// 前後の記事（prev = 1つ古い記事 / next = 1つ新しい記事）
export async function fetchAdjacentPosts(slug: string): Promise<{ prev: PostLink | null; next: PostLink | null }> {
    const query = `
    query GetPostLinks {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes { slug title }
      }
    }
  `;

    const data = await request<{ posts: { nodes: PostLink[] } }>(query);
    const posts = data?.posts?.nodes ?? [];
    const index = posts.findIndex((post) => post.slug === slug);
    if (index === -1) return { prev: null, next: null };

    return {
        prev: posts[index + 1] ?? null,
        next: posts[index - 1] ?? null,
    };
}

export type SidebarPost = {
    id: string;
    title: string;
    slug: string;
    categories: { nodes: { id: string; name: string }[] };
    featuredImage: { node: { sourceUrl: string; altText: string } } | null;
};

export type Tag = { id: string; name: string; slug: string };

// サイドバー（人気記事・タグ一覧）
export async function fetchSidebarData(): Promise<{ popularPosts: SidebarPost[]; tags: Tag[] }> {
    const query = `
    query GetSidebar {
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          categories { nodes { id name } }
          featuredImage { node { sourceUrl altText } }
        }
      }
      tags(first: 30, where: { hideEmpty: true }) {
        nodes { id name slug }
      }
    }
  `;

    const data = await request<{ posts: { nodes: SidebarPost[] }; tags: { nodes: Tag[] } }>(query);
    return {
        popularPosts: data?.posts?.nodes ?? [],
        tags: data?.tags?.nodes ?? [],
    };
}
