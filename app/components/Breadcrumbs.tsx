"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { generateBreadcrumbs } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Fragment } from "react";



export default function Breadcrumbs({ currentLabel }: { currentLabel?: string }) {
    const pathName = usePathname();
    const breadcrumbPaths = generateBreadcrumbs(pathName, currentLabel);
    return (
        <Breadcrumb>
            <BreadcrumbList className="gap-2 text-xs">
                {breadcrumbPaths.map(({ path, label }, index) => (
                    <Fragment key={path}>
                        {index !== 0 && (
                            <BreadcrumbSeparator className="font-mono leading-[1.4] font-medium tracking-[0.48px] text-(--color-accent-primary)">/</BreadcrumbSeparator>
                        )}
                        <BreadcrumbItem>
                            {index !== breadcrumbPaths.length - 1 && (
                                <BreadcrumbLink href={path} className="font-mono leading-[1.4] font-medium tracking-[0.48px] text-(--color-text-secondary) hover:text-(--color-text-primary)">{label}</BreadcrumbLink>
                            )}
                            {index === breadcrumbPaths.length - 1 && (
                                <BreadcrumbPage className="font-plex leading-normal font-medium tracking-[0.72px] text-(--color-text-primary)">{label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}