import type { NextPage } from 'next'
import useSWR from 'swr'
import { fetcher } from 'src/utils'
import { useUserState } from 'src/hooks/useGlobalState'
import Link from 'next/link'
import { useRequireSignedIn } from 'src/hooks/useRequireSignedIn'
import Spinner from 'src/@core/components/spinner'

const HealthCheck: NextPage = () => {
  useRequireSignedIn()
  const [user] = useUserState()

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/health_check'
  const { data, error } = useSWR(url, fetcher)

  if (error) return <div>An error has occurred.</div>
  if (!data) return <Spinner />

  return (
    <>
      <div>Rails疎通確認</div>
      <div>レスポンスメッセージ: {data.message}</div>
      {user.isSignedIn && 
        <>
          <div>{user.name}</div>
          <Link href="/sign_out">
              サインアウト
          </Link>
        </>
      }
    </>
  )
}

export default HealthCheck
