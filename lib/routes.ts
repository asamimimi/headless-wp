
/**
 * ページルート
 */
export enum PageRoute {
    HOME = "/",
    POSTS = "/posts",
    CATEGORY = "/category",
}

/**
 * ページ名（動的ページは currentLabel で上書きされる）
 */
export const pageNameMap: Record<string, string> = {
    [PageRoute.HOME]: "Home",
    [PageRoute.POSTS]: "新着記事一覧",
};
