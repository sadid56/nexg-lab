import Container from "@/components/global/Container";
import Navbar from "@/components/layouts/navbar";
import RightSidebar from "@/components/layouts/right-sidebar";
import { ReactNode } from "react";

const BlogsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='bg-gray-50 dark:bg-[#0b0700]'>
      <Navbar />
      <Container className=' relative flex'>
        <div className='flex-1 md:pr-5 pt-[70px] md:pt-20'>{children}</div>

        <div className='hidden lg:block w-[350px] border-l-2 dark:border-hidden border-gray-200 min-h-screen relative'>
          <div className='absolute dark:block hidden left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-orange-200 dark:via-orange-900 to-transparent' />

          <div className='sticky top-0 pb-5 overflow-y-auto'>
            <RightSidebar />
          </div>
        </div>
      </Container>
    </main>
  );
};

export default BlogsLayout;
