import { GraphQLClient } from 'graphql-request';


export const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
export const client = new GraphQLClient(endpoint);
