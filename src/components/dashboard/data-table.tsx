import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { NoData } from "@/components/ui/no-data";

interface DashboardTableProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  data?: any[];
  children: React.ReactNode;
}

export function DashboardTable({ title, description, isLoading, data, children }: DashboardTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <CardContent>
          <div className='rounded-md border'>{children}</div>
          {(!data || data.length === 0) && <NoData />}
        </CardContent>
      )}
    </Card>
  );
}
