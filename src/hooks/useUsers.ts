import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchUsers } from "../services/users"
import { type User } from "../types"

export const useUsers = () => {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery<{ nextCursor ?: Number, users: User[] }>(
    ['users'],
    fetchUsers,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 10
    }
  )

  return {
    isLoading, 
    isError, 
    users: data?.pages.flatMap((page) => page.users) ?? [],
    refetch,
    fetchNextPage,
    hasNextPage
  }
}