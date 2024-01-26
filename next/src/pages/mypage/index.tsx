// import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp'
import { LoadingButton } from '@mui/lab'
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'
import Link from 'next/link'

// import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import useSWR from 'swr'

// import Error from 'src/components/Error'
// import Loading from 'src/components/Loading'
import { useUserState, useSnackbarState } from 'src/hooks/useGlobalState'
import { useRequireSignedIn } from 'src/hooks/useRequireSignedIn'
import { fetcher } from 'src/utils'

type ArticleProps = {
  name: string
  email: string
}

type ArticleFormData = {
  name: string
  email: string
}

const CurrentArticlesEdit: NextPage = () => {
  useRequireSignedIn()

  // const router = useRouter()
  const [user] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  const [previewChecked, setPreviewChecked] = useState<boolean>(false)
  const [statusChecked, setStatusChecked] = useState<boolean>(false)
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChangePreviewChecked = () => {
    setPreviewChecked(!previewChecked)
  }

  const handleChangeStatusChecked = () => {
    setStatusChecked(!statusChecked)
  }

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/user/'
  const { data, error } = useSWR(
    user.isSignedIn ? url : null,
    fetcher,
  )

  const mydata: ArticleProps = useMemo(() => {
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

  const { handleSubmit, control, reset } = useForm<ArticleFormData>({
    defaultValues: mydata,
  })

  useEffect(() => {
    if (data) {
      reset(mydata)
      setIsFetched(true)
    }
  }, [data, mydata, reset])

  const onSubmit: SubmitHandler<ArticleFormData> = (data) => {
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
          message: '記事を保存しました',
          severity: 'success',
          pathname: '/current/mypage',
        })
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: '記事の保存に失敗しました',
          severity: 'error',
          pathname: '/current/mypage',
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
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#EDF2F7',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: 50 }}>
            <Link href="/current/articles">
              <IconButton>
                {/* <ArrowBackSharpIcon /> */}
              </IconButton>
            </Link>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: { xs: '0 16px', sm: '0 24px' },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Switch
                checked={previewChecked}
                onChange={handleChangePreviewChecked}
              />
              <Typography sx={{ fontSize: { xs: 12, sm: 15 } }}>
                プレビュー表示
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Switch
                checked={statusChecked}
                onChange={handleChangeStatusChecked}
              />
              <Typography sx={{ fontSize: { xs: 12, sm: 15 } }}>
                下書き／公開
              </Typography>
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
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{ pt: 11, pb: 3, display: 'flex', justifyContent: 'center' }}
      >
        {!previewChecked && (
          <Box sx={{ width: 840 }}>
            <Box sx={{ mb: 2 }}>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="text"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    placeholder="Write in Title"
                    fullWidth
                    sx={{ backgroundColor: 'white' }}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                name="content"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="textarea"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    multiline
                    fullWidth
                    placeholder="Write in Markdown Text"
                    rows={25}
                    sx={{ backgroundColor: 'white' }}
                  />
                )}
              />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default CurrentArticlesEdit