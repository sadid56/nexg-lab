import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface DashboardSearchProps {
  term: string;
  setTerm: (value: string) => void;
  placeholder?: string;
  count?: number;
  countLabel?: string;
  children?: React.ReactNode;
}

export function DashboardSearch({ term, setTerm, placeholder = "Search...", count, countLabel = "items", children }: DashboardSearchProps) {
  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input placeholder={placeholder} value={term} onChange={(e) => setTerm(e.target.value)} className='pl-9' />
          </div>
          <div className='flex items-center gap-2'>
            {count !== undefined && (
              <Badge variant='outline' className='text-sm'>
                {count} {countLabel}
              </Badge>
            )}
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
