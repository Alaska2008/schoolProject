import Announcement from "@/components/Announcement"
import BigCalendar from "@/components/BigCalendar"
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"

const ParentPage = async () => {
    const {  userId } = auth();
    const currentUserId = userId;

    const students = await prisma.student.findMany({
        where:{
            parentId: currentUserId!,
        }
    })
    return(
        <div className=" flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {students.map((student) => (
                <div key={student.id} className="w-full xl:w-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">
                        Schedule ({student.name + " " + student.surname})
                    </h1>
                    <BigCalendarContainer type="classId" id={student.classId}/>
                </div>
            </div>
            ))}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <div>
                    <Announcement />
                </div>
            </div>
        </div>
    )
}

export default ParentPage