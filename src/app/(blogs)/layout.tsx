"use client";

import Container from "@/components/global/Container";
import Navbar from "@/components/layouts/Navbar";
import RightSidebar from "@/components/layouts/right-sidebar";
import { ReactNode } from "react";
import { useCustomization } from "@/providers/CustomizationProvider";
import { cn } from "@/lib/utils";

const BlogsLayout = ({ children }: { children: ReactNode }) => {
  const { isZenMode, isRightSidebarHidden } = useCustomization();

  const hideSidebar = isZenMode || isRightSidebarHidden;

  return (
    <main className='bg-gray-50 dark:bg-[#0b0700] min-h-screen transition-colors duration-500'>
      {!isZenMode && <Navbar />}
      <Container className={cn("relative flex transition-all duration-500", isZenMode && "justify-center")}>
        <div
          className={cn(
            "flex-1 pb-10 transition-all duration-500",
            !isZenMode && "pt-[70px] md:pt-20",
            isZenMode && "pt-10 max-w-3xl",
            !hideSidebar && "lg:pr-5 lg:max-w-[75%] max-w-full",
            hideSidebar && !isZenMode && "max-w-4xl mx-auto",
          )}
        >
          {children}
        </div>

        {!hideSidebar && (
          <div className='hidden lg:block max-w-[25%] border-l-2 dark:border-hidden border-gray-200 relative'>
            <div className='absolute dark:block hidden left-0 top-0 h-full w-[2px] bg-linear-to-b from-transparent via-orange-200 dark:via-orange-900 to-transparent' />

            <div className='sticky top-0 h-[calc(100vh-0px)]'>
              <div className='h-full overflow-y-auto pb-5'>
                <RightSidebar />
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};

export default BlogsLayout;
