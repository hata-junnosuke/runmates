import jaLocale from "@fullcalendar/core/locales/ja"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import { LoadingButton } from "@mui/lab"
import { Box, TextField, Stack } from "@mui/material"
import Modal from "@mui/material/Modal"
import axios, { AxiosError } from "axios"
import dayjs from "dayjs"
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
  comment: string | null
}

const eventExample = [
  //背景のカラーもこの中で指定できる
  {
    title: "温泉旅行",
    start: new Date(),
    end: new Date().setDate(new Date().getDate() + 5),
    description: "友達と温泉旅行",
    backgroundColor: "green",
    borderColor: "green",
  },
  {
    title: "期末テスト",
    start: new Date().setDate(new Date().getDate() + 5),
    description: "2年最後の期末テスト",
    backgroundColor: "blue",
    borderColor: "blue",
  },
]

const Calendar = () => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"))
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()
  const { handleSubmit, control, setValue } = useForm<RecordFormData>({
    defaultValues: {
      distance: null,
      date: selectedDate,
      comment: null,
    },
  })

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr)
    setValue("date", arg.dateStr)
    handleOpen()
  }

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
        router.reload()
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
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={jaLocale}
        initialView="dayGridMonth"
        events={eventExample}
        headerToolbar={{
          start: "prevYear,nextYear",
          center: "title",
          end: "today prev,next",
        }}
        contentHeight={"700px"}
        dateClick={handleDateClick}
      />
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
    </>
  )
}

export default Calendar
