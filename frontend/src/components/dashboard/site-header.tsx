// components/dashboard/site-header.tsx
// See https://ui.shadcn.com/docs for more
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export function SiteHeader({
  title,
  breadcrumb,
  debateId,
}: {
  title: string;
  breadcrumb?: string | string[];
  debateId?: string;
}) {
  const navigate = useNavigate();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="flex-1 overflow-hidden">
          <BreadcrumbList className="flex flex-nowrap overflow-hidden">
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate(`/dashboard/${title.toLowerCase()}`)}
              >
                <h1 className="text-base font-medium text-white hover:cursor-pointer">
                  {title}
                </h1>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumb && Array.isArray(breadcrumb) && debateId ? (
              <>
                <BreadcrumbSeparator />
                {breadcrumb.map((b, idx) => {
                  if (idx === breadcrumb.length - 1) {
                    return (
                      <BreadcrumbItem key={`breadcrumb-${idx}`}>
                        <BreadcrumbPage className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-[300px] lg:max-w-[800px]">
                          {b}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    );
                  }
                  return (
                    <>
                      <BreadcrumbItem key={`breadcrumb-${idx}`}>
                        <BreadcrumbLink
                          key={`breadcrumb-${idx}`}
                          onClick={() =>
                            navigate(
                              `/dashboard/${title.toLowerCase()}/${debateId}`
                            )
                          }
                          className="hover:cursor-pointer"
                        >
                          <BreadcrumbPage>{b}</BreadcrumbPage>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  );
                })}
              </>
            ) : (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a href="/" className="dark:text-foreground">
              <div className="text-white">Openfloor.</div>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
