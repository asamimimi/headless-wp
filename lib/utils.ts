import { pageNameMap, PageRoute } from "@/lib/routes";



export { cn } from "cn"

/**
 * パンくずを生成
 * @param pathName
 * @returns
 */
export function generateBreadcrumbs(pathName: string, currentLabel?: string) {
    const arrPathName = pathName.split("/").filter((x) => x !== "");
    // 一覧ページが存在しない中間パスはパンくずに出さない
    const breadcrumbPaths = [
        "/",
        ...arrPathName.map((value, index, arr) =>
            index === 0 ? `/${value}` : `/${arr.slice(0, index).join("/")}/${value}`,
        ),
    ].filter((path) => path !== PageRoute.CATEGORY);

    return breadcrumbPaths.map((path, index) => {
        const isLast = index === breadcrumbPaths.length - 1;

        return {
            path,
            label: (isLast && currentLabel) || pageNameMap[path] || path,
        };
    });
}