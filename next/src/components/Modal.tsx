import { LoadingButton } from "@mui/lab"
import { Box, TextField, Stack } from "@mui/material"
import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import axios, { AxiosError } from "axios"
import dayjs, { extend } from "dayjs"
import duration from "dayjs/plugin/duration"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { useSnackbarState } from "@/hooks/useGlobalState"

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

type RecordFormData = {
  distance: number | null
  date: string
  comment: string
}

const BasicModal = () => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [isLoading, setIsLoading] = useState(false)
  // const [user, setUser] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  extend(duration)
  const today = dayjs().format("YYYY-MM-DD")
  const { handleSubmit, control } = useForm<RecordFormData>({
    defaultValues: { distance: null, date: today, comment: "" },
  })

  const onSubmit: SubmitHandler<RecordFormData> = (data) => {
    setIsLoading(true)
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/records"
    const headers = {
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token"),
      client: localStorage.getItem("client"),
      uid: localStorage.getItem("uid"),
    }

    const postData = { ...data }

    axios({
      method: "POST",
      url: url,
      data: postData,
      headers: headers,
    })
      .then(() => {
        setSnackbar({
          message: "レコードの追加に成功しました",
          severity: "success",
          pathname: "/",
        })
        router.push("/")
        setOpen(false)
        setIsLoading(false)
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message)
        setSnackbar({
          message: "レコードの追加に失敗しました",
          severity: "error",
          pathname: "/records",
        })
        setIsLoading(false)
      })
  }

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        sx={{
          color: "white",
          fontWeight: "bold",
          width: 100,
        }}
        onClick={handleOpen}
      >
        記録する
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
            <Controller
              name="distance"
              control={control}
              // rules={validationRules.email}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="走行距離"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="date"
              control={control}
              // rules={validationRules.password}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="date"
                  label="日付"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="comment"
              control={control}
              // rules={validationRules.password}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  label="コメント"
                  multiline
                  rows={4}
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
              記録する
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
    </div>
  )
}

export default BasicModal
