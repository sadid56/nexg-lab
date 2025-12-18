"use client";

import { Spinner } from "@/components/ui/spinner";

const GlobalLoading = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <Spinner className='w-16 h-16 text-orange-500' />
    </div>
  );
};

export default GlobalLoading;
