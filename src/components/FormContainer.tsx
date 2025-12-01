import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { currentUser } from "@/lib/currentUser";

export type FormContainerProps ={
    table:"student" | "teacher" | "parent" | "attendance" | "event" | "announcement"
        | "subject" | "class" | "lesson" | "assignment" | "result" | "exam";
    type : "create" | "update" | "delete";
    data? : any;
    id? : number | string;
};

const FormContainer = async({table, type, data, id
    }:FormContainerProps)=>{
    
    const user = await currentUser();
    const role = user?.role;
    const currentUserId = user?.userId;
        
    let relatedData ={};

    if(type !== "delete"){
        switch (table) {
            case "subject":
                const subjectTeachers = await prisma.teacher.findMany({
                    select: {id: true, name: true, surname: true},
                })
                relatedData = {teachers: subjectTeachers};
                break;
            case "class":
                // const classGrades = await prisma.grade.findMany({
                //     select: {id: true, level: true},
                // });
                const classTeachers = await prisma.teacher.findMany({
                    select: {id: true, name: true, surname: true},
                });
                relatedData = {teachers: classTeachers};
                break;

            case "teacher":
                const teacherSubjects = await prisma.subject.findMany({
                    select: {id: true, name: true},
                });
                relatedData = {subjects: teacherSubjects };
                break;
            case "student":
                // const studentGrades = await prisma.grade.findMany({
                //     select: {id: true, level: true},
                // });
                const studentClasses = await prisma.class.findMany({
                    include: { _count: {select: { students: true}}},
                });
                relatedData = {classes: studentClasses};
                break;
            case "exam":
                const examLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {})
                    },
                }); 
                relatedData = {lessons: examLessons};
                break;
            case "assignment":
                const assignmentLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {})
                    },
                }); 
                relatedData = {lessons: assignmentLessons};
                break;
            case "parent":
                const studentsofParent = await prisma.student.findMany({
                    select: {id: true, name: true, surname: true, class: {select:{name: true}}},
                });
                relatedData = {students: studentsofParent };
                break;
            case "lesson":
                const studentsofParent1 = await prisma.student.findMany({
                    select: {id: true, name: true, surname: true, class: {select:{name: true}}},
                });
                relatedData = {students: studentsofParent1 };
                break;
        
            default:
                break;
        }
    };

    return(
        <div className="">
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    )
};

export default FormContainer;