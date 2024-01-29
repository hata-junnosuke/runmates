import type { NextPage } from "next"
import useSWR from "swr"
import Error from "@/components/Error"
import Loading from "@/components/Loading"
import { useUserState } from "@/hooks/useGlobalState"
import { useRequireSignedIn } from "@/hooks/useRequireSignedIn"
import { fetcher } from "@/utils"

const Index: NextPage = () => {
  useRequireSignedIn()

  const [user] = useUserState()
  const url = "http://localhost:3000/api/v1/records"
  const { data, error } = useSWR(user.isSignedIn && url, fetcher)

  if (error) return <Error />
  if (!data) return <Loading />

  return (
    <>
      <div>あなたの走行距離: {data.current_user_distance}</div>
    </>
  )
}

export default Index
