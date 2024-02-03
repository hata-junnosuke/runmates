import jaLocale from "@fullcalendar/core/locales/ja"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"

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

const handleDateClick = (arg: { date: Date }) => {
  // arg.dateにクリックされた日付が含まれています
  console.log("日付がクリックされました:", arg.date)
}

const Calendar = () => {
  return (
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
      dateClick={handleDateClick} // dateClickイベントを設定
    />
  )
}

export default Calendar
