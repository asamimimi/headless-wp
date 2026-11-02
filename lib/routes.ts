
/**
 * ページルート
 */
export enum PageRoute {
    HOME = "/",
    POSTS = "/posts",
    CATEGORY = "/category",
    SEARCH = "/search",
}

/**
 * ページ名（動的ページは currentLabel で上書きされる）
 */
export const pageNameMap: Record<string, string> = {
    [PageRoute.HOME]: "Home",
    [PageRoute.POSTS]: "新着記事一覧",
    [PageRoute.SEARCH]: "検索結果",
};
