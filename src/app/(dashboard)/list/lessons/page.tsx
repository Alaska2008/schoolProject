import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
// import { role } from "@/lib/utils";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";


const { userId, sessionClaims} = auth();
const currentUserId = userId;
const role = (sessionClaims?.metadata as {role?: string})?.role;
type LessonList = Lesson & { subject: Subject } & {class: Class} & { teacher: Teacher };
const columns =[
    {
        header: "Subject Name", 
        accessor: "name"
    },
    {
        header: "Class",
        accessor: "class",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    ...(role === "admin" ? [
        {
            header: "Actions",
            accessor: "action"
        },
    ]:[])
]
const renderRow =(item: LessonList)=>(
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-xs hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-3 p-2"> {item.subject.name} </td>
        <td className="hidden md:table-cell">{item.class.name}</td>
        <td className="hidden md:table-cell">{item.teacher.name + " " + item.teacher.surname}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="lesson" type="update" data={item}/>
                        <FormModal table="lesson" type="delete" id={item.id}/>
                    </>
                    
                )}
            </div>
        </td>
    </tr>
);
const LessonListPage = async ({
    searchParams
}:{
    searchParams: {[key: string]: string} | undefined;
}) =>{
    const pageStr = searchParams?.page;
    const p = pageStr ? parseInt(pageStr) : 1;

    const queryParams = { ...searchParams };
    delete queryParams.page;

    const query: Prisma.LessonWhereInput={};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams) ){
            if(value !== undefined) {
                switch (key) {
                    case "teacherId":
                        query.teacherId = value;
                        break;
                    case "classId":
                        query.classId = parseInt(value);
                        break;
                    case "search":
                        query.OR =[
                            { subject: { name: {contains:value, mode: "insensitive"}} },
                            { teacher: { name: {contains:value, mode: "insensitive"}} },
                        ]
                        
                        break;
                    default:
                        break;
                }
            }
        }
    }
    // switch (role) {
    //         case "admin":
    //             break;
    //         case "teacher":
    //             query.lesson.teacherId = currentUserId!;
    //             break;
    //         case "student":
    //             query.lesson.class ={
    //                 students: {
    //                     some: {id: currentUserId!,}
    //                 }
    //             };
    //             break;
    //         case "parent":
    //             query.lesson.class ={
    //                 students: {
    //                     some: {
    //                         parentId: currentUserId!,
    //                     }
    //                 }
    //             };
    //             break;
    //         default:
    //             break;
    //     }
    const [data, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            include:{
            subject: {select: {name: true}},
            class: {select: {name: true}},
            teacher: {select: {name: true, surname: true}},
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE*(p-1),
        }),
        prisma.lesson.count({where: query}),
    ]);
    return (
        <div className="bg-white  text-xs p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 items-center justify-items-center rounded-full bg-lamaYellow">
                            <Image src='/filter.png' width={14} height={14} alt=""/>
                        </button>
                        <button className="w-8 h-8 items-center justify-items-center rounded-full bg-lamaYellow">
                            <Image src='/sort.png' width={14} height={14} alt=""/>
                        </button>
                        {role ==='admin' && (

                            <FormModal table="lesson" type="create" />
                        )}
                        
                    </div>
                </div>
            </div>
            <Table 
                columns={columns}
                renderRow={renderRow}
                data={data}
            />
            <Pagination page={p} count={count} />
        </div>
    )
}
export default LessonListPage;