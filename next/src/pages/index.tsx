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
  const url = "http://localhost:3000/api/v1/health_check"
  const { data, error } = useSWR(user.isSignedIn && url, fetcher)

  if (error) return <Error />
  if (!data) return <Loading />

  return (
    <>
      <div>Rails疎通確認</div>
      <div>レスポンスメッセージ: {data.message}</div>
    </>
  )
}

export default Index
