import { LoadingButton } from "@mui/lab"
import { Box, TextField, Stack } from "@mui/material"
import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import axios, { AxiosResponse, AxiosError } from "axios"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { useUserState, useSnackbarState } from "@/hooks/useGlobalState"

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

type SignInFormData = {
  email: string
  password: string
}

const BasicModal = () => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  const { handleSubmit, control } = useForm<SignInFormData>({
    defaultValues: { email: "", password: "" },
  })

  const onSubmit: SubmitHandler<SignInFormData> = (data) => {
    setIsLoading(true)
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/sign_in"
    const headers = { "Content-Type": "application/json" }

    axios({ method: "POST", url: url, data: data, headers: headers })
      .then((res: AxiosResponse) => {
        localStorage.setItem("access-token", res.headers["access-token"])
        localStorage.setItem("client", res.headers["client"])
        localStorage.setItem("uid", res.headers["uid"])
        setUser({
          ...user,
          isFetched: false,
        })
        setSnackbar({
          message: "サインインに成功しました",
          severity: "success",
          pathname: "/",
        })
        router.push("/")
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message)
        setSnackbar({
          message: "登録ユーザーが見つかりません",
          severity: "error",
          pathname: "/sign_in",
        })
        setIsLoading(false)
      })
  }

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
            <Controller
              name="email"
              control={control}
              // rules={validationRules.email}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  label="メールアドレス"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              // rules={validationRules.password}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="password"
                  label="パスワード"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
            <LoadingButton
              variant="contained"
              type="submit"
              loading={isLoading}
              sx={{ fontWeight: "bold", color: "white" }}
            >
              送信する
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
    </div>
  )
}

export default BasicModal
