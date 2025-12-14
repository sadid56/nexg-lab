"use client";

import React from "react";

interface TableSkeletonProps {
  columns?: number; // number of table columns
  rows?: number; // number of skeleton rows (default 5)
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns = 6, rows = 5 }) => {
  return (
    <div className='overflow-x-auto w-full'>
      <table className='w-full border-collapse'>
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, idx) => (
              <th key={idx} className='p-4 bg-gray-100 dark:bg-gray-800'>
                <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className='border-b border-gray-200 dark:border-gray-700'>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className='p-4'>
                  <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
