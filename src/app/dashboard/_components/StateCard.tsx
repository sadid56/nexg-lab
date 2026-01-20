import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCard = ({ title, value, icon: Icon, description, isLoading, color }: any) => (
  <Card className='relative overflow-hidden group hover:shadow-lg transition-all duration-500 border-muted/50'>
    <div
      className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-linear-to-br ${color} opacity-10 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-110`}
    />
    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
      <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
      <div className={`p-2 rounded-xl bg-linear-to-br ${color} bg-opacity-20 text-opacity-100`}>
        <Icon className='w-4 h-4 text-foreground' />
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className='h-8 w-24' />
      ) : (
        <>
          <div className='text-3xl font-bold tracking-tight'>{value}</div>
          <p className='text-xs text-muted-foreground mt-1'>{description}</p>
        </>
      )}
    </CardContent>
  </Card>
);
