import Announcement from "@/components/Announcement"
import AttendanceChart from "@/components/AttendanceChart"
import CountChart from "@/components/CountChart"
import CountChartContainer from "@/components/CountChartContainer"
import EventCalendar from "@/components/EventCalendar"
import FinanceChart from "@/components/FinanceChart"
import UserCard from "@/components/UserCard"

const AdminPage =() =>{
    return (
        <div className="px-4 text-xs py-2 flex gap-4 flex-col md:flex-row">
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type="admin" />
                    <UserCard type="teacher" />
                    <UserCard type="student" />
                    <UserCard type="parent" />
                    
                </div>
                <div className="flex gap-4 flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 h-[400px]">
                        <CountChartContainer />
                    </div>
                    <div className="w-full lg:w-2/3 h-[400px]">
                        <AttendanceChart />
                    </div>
                </div>
                <div className="w-full h-[400px]">
                    <FinanceChart />
                </div>
            </div>
            <div className="w-full lg:w-1/3 flex flex-col gap=8">
                <EventCalendar />
                <Announcement />
            </div>
        </div>
    )
}
export default AdminPage