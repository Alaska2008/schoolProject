import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";

const SingleStudentPage = ()=>{
    return(
        <div className="flex-1 text-xs px-4 flex flex-col gap-4 xl:flex-row">
            <div className="w-full xl:w-2/3">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="bg-lamaSky py-2 px-4 rounded-md flex-1 flex gap-1">
                        <div className="w-1/3">
                            <Image 
                                src= "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                alt="" width={144} height={144}
                                className="w-36 h-36 rounded-full object-cover"
                            />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-1">
                            <div className="flex  justify-between">
                                <h1 className="text-xl font-semibold">cameroon Morgan</h1>
                                <FormModal table="teacher" type="update"
                                    data={{
                                        id: 7,
                                        username:"Kwekumensah",
                                        firstName: "Allen Black",
                                        lastName: "Allen Black",
                                        email: "allen@black.com",
                                        photo: 
                                        "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200",
                                        phone: "+1 234 567 890",
                                        subjects: ["English", "Spanish"],
                                        classes: ["5A", "4B", "3C"],
                                        sex:"male",
                                        bloodType: "A+",
                                        birthday: "2000-01-01",
                                        address: "123 Main St, Anytown, USA",
                                    }}
                                />
                            </div>
                            
                            <p className="text-sm text-gray-500">
                                Lorem ipsum, dolor sit amet consecteur adispisicing elit.
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2" >
                                    <Image src="/blood.png" alt="" width={14} height={14} />
                                    <span>A+</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/date.png" alt="" width={14} height={14} />
                                    <span>August 2025</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14} />
                                    <span>user@gmail.com</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14} />
                                    <span>+233592412509</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:[45%] lg:w[48%]">
                            <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div>
                                <h1 className="text-xl font-semibold">90%</h1>
                                <span className="text-sm text-gray-400">Attendance</span>
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:[45%] 2xl:w[48%]">
                            <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div>
                                <h1 className="text-xl font-semibold">6th</h1>
                                <span className="text-sm text-gray-400">Grade</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:[45%] 2xl:w[48%]">
                            <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div>
                                <h1 className="text-xl font-semibold">18</h1>
                                <span className="text-sm text-gray-400">Lesson</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:[45%] 2xl:w[48%]">
                            <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div>
                                <h1 className="text-xl font-semibold">6A</h1>
                                <span className="text-sm text-gray-400">Class</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h1>Student&apos;s Schedule</h1>
                    <BigCalendar />
                </div>
            </div>
            <div className="w-full flex flex-col gap-4 xl:w-1/3">
                <div className="bg-white p-1 rounded-md">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-gray-500">
                        <Link className="p-1 rounded-md bg-lamaSkyLight" href={`/list/lessons?classId=${2}`} >
                            Student&apos;s Lessons
                        </Link>
                        <Link className="p-1 rounded-md bg-lamaPurpleLight" href={`/list/teachers?classId=${2}`}  >
                            Student&apos;s Teachers
                        </Link>
                        <Link className="p-1 rounded-md bg-lamaYellowLight" href={`/list/exams?classId=${2}`} >
                            Student&apos;s Exams
                        </Link>
                        <Link className="p-1 rounded-md bg-lamaSkyLight" href={`/list/assignments?classId=${2}`} >
                            Student&apos;s Assignments
                        </Link>
                        <Link className="p-1 rounded-md bg-pink-50" href={`/list/results?studentId=${"student2"}`} >
                            Student&apos;s Results
                        </Link>

                    </div>
                </div>
                <Performance />
                <Announcement />
            </div>
        </div>
    )
}
export default SingleStudentPage;