import { BlogCardHorizontalSkeleton } from "./_components/BlogCardHorizentalSkeketon";

const loading = () => {
  return (
    <div className='space-y-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <BlogCardHorizontalSkeleton key={i} />
      ))}
    </div>
  );
};

export default loading;
