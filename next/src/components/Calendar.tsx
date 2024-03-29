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
import useSWR from "swr"
import Error from "@/components/Error"
import Loading from "@/components/Loading"
import { useSnackbarState } from "@/hooks/useGlobalState"
import { fetcher } from "@/utils"

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

const Calendar = () => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"))
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()

  // TODO: APIの検討、型を指定する
  const url = "http://localhost:3000/api/v1/records"
  const { data, error } = useSWR(url, fetcher)
  // eslint-disable-next-line
  const eventExample = data.date_records.map((dateRecord: any) => ({
    title: `距離:${dateRecord.distance}km`,
    start: dateRecord.date,
    backgroundColor: dateRecord.distance >= 10 ? "darkgreen" : "green",
    borderColor: dateRecord.distance >= 10 ? "darkgreen" : "green",
  }))
  // eslint-disable-next-line
  const backgroundEvents = data.date_records.map((dateRecord: any) => ({
    start: dateRecord.date,
    backgroundColor: dateRecord.distance >= 10 ? "darkgreen" : "green",
    display: "background",
  }))

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

  if (error) return <Error />
  if (!data) return <Loading />

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={jaLocale}
        initialView="dayGridMonth"
        events={[...eventExample, ...backgroundEvents]}
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
