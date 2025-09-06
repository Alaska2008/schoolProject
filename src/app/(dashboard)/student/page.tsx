import Announcement from "@/components/Announcement"
import BigCalendar from "@/components/BigCalendar"
import EventCalendar from "@/components/EventCalendar"

const StudentPage = () => {
    return(
        <div className="p-4 flex flex-1 gap-4 flex-col xl:flex-row">
            <div className="w-full xl:w-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Schedule B4</h1>
                    <BigCalendar />
                </div>
            </div>
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <div>
                    <EventCalendar />
                    <Announcement />
                </div>
            </div>
        </div>
    )
}

export default StudentPage