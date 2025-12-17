import Container from "@/components/global/Container";
import Navbar from "@/components/layouts/navbar";
import RightSidebar from "@/components/layouts/right-sidebar";
import React, { ReactNode } from "react";

const BlogsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <Navbar />
      <Container className='pt-20 relative flex'>
        {/* Left: Main Content */}
        <div className='flex-1 pr-8'>{children}</div>

        {/* Right: Fixed Sidebar */}
        <div className='hidden lg:block w-[300px]'>
          <div className='sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto'>
            <RightSidebar />
          </div>
        </div>
      </Container>
    </main>
  );
};

export default BlogsLayout;
