import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useUserState, useSnackbarState } from 'src/hooks/useGlobalState'

const SignOut: NextPage = () => {
  const router = useRouter()
  const [, setUser] = useUserState()
  const [, setSnackbar] = useSnackbarState()

  useEffect(() => {
    localStorage.clear()
    setUser({
      id: 0,
      name: '',
      email: '',
      isSignedIn: false,
      isFetched: true,
    })
    setSnackbar({
      message: 'サインアウトしました',
      severity: 'success',
      pathname: '/sign_in',
    })
    router.push('/sign_in')
  }, [router, setUser, setSnackbar])

  return <></>
}

export default SignOut