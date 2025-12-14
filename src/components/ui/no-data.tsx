"use client";

import { FC, ReactNode } from "react";
import { Inbox } from "lucide-react";

interface NoDataProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export const NoData: FC<NoDataProps> = ({ title = "No data found", description = "Nothing to show here yet.", icon }) => {
  return (
    <div className='flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
      <div className='flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 mb-4'>
        {icon || <Inbox className='w-8 h-8 text-gray-400 dark:text-gray-500' />}
      </div>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{title}</h3>
      <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{description}</p>
    </div>
  );
};
