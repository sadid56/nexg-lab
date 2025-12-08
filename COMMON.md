\*\*\* Use tanstack query for data fetch in next js server component app router

import {
dehydrate,
HydrationBoundary,
QueryClient,
} from '@tanstack/react-query'
import Posts from './posts'

export default async function PostsPage() {
const queryClient = new QueryClient()

await queryClient.prefetchQuery({
queryKey: ['posts'],
queryFn: getPosts,
})

return (
// Neat! Serialization is now as easy as passing props.
// HydrationBoundary is a Client Component, so hydration will happen there.
<HydrationBoundary state={dehydrate(queryClient)}>
<Posts />
</HydrationBoundary>
)
}
