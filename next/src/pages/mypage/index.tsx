// import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp'
import { LoadingButton } from '@mui/lab'
import {

  // AppBar,
  Box,
  Container,

  // IconButton,
  // Switch,
  TextField,

  // Toolbar,
  // Typography,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'

// import Link from 'next/link'

// import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import useSWR from 'swr'

// import Error from 'src/components/Error'
// import Loading from 'src/components/Loading'
import { useUserState, useSnackbarState } from 'src/hooks/useGlobalState'
import { useRequireSignedIn } from 'src/hooks/useRequireSignedIn'
import { fetcher } from 'src/utils'

type UseDataProps = {
  name: string
  email: string
}

type UserDataFormData = {
  name: string
  email: string
}

const CurrentArticlesEdit: NextPage = () => {
  useRequireSignedIn()

  // const router = useRouter()
  const [user] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/user/'
  const { data, error } = useSWR(
    user.isSignedIn ? url : null,
    fetcher,
  )

  const userData: UseDataProps = useMemo(() => {
    if (!data) {
      return {
        name: "",
        email: ""
      }
    }

    return {
      name: data.name,
      email: data.email
    }
  }, [data])

  const { handleSubmit, control, reset } = useForm<UserDataFormData>({
    defaultValues: userData,
  })

  useEffect(() => {
    if (data) {
      reset(userData)
      setIsFetched(true)
    }
  }, [data, userData, reset])

  const onSubmit: SubmitHandler<UserDataFormData> = (data) => {
    if (data.name == '') {
      return setSnackbar({
        message: 'ユーザー名が入力されていません',
        severity: 'error',
        pathname: '/current/mypage',
      })
    }

    if (data.email == '') {
      return setSnackbar({
        message: 'メールアドレスが入力されていません',
        severity: 'error',
        pathname: '/current/mypage',
      })
    }

    setIsLoading(true)

    const patchUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + '/current/user/'

    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    const patchData = { ...data}

    axios({
      method: 'PATCH',
      url: patchUrl,
      data: patchData,
      headers: headers,
    })
      .then(() => {
        setSnackbar({
          message: 'ユーザー情報を更新しました',
          severity: 'success',
          pathname: '/mypage',
        })
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: 'ユーザー情報の更新に失敗しました',
          severity: 'error',
          pathname: '/mypage',
        })
      })
    setIsLoading(false)
  }

  if (error) return <div>hoge</div>
  if (!data || !isFetched) return <div>hoge</div>

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ backgroundColor: '#EDF2F7', minHeight: '100vh' }}
    >
      <Container
        maxWidth="lg"
        sx={{ pt: 11, pb: 3, display: 'flex', justifyContent: 'center' }}
      >
        <Box sx={{ width: 840 }}>
          <Box sx={{ mb: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  placeholder="ユーザー名を入力してください。"
                  fullWidth
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  placeholder="メールアドレスを入力してください。"
                  fullWidth
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
          </Box>

          <LoadingButton
            variant="contained"
            type="submit"
            loading={isLoading}
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: 12, sm: 16 },
            }}
          >
            更新する
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  )
}

export default CurrentArticlesEdit