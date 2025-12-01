"use server";

import { revalidatePath } from "next/cache";
import { AssignmentSchema, ClassSchema, ExamSchema, LessonSchema, ParentSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import prisma from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "./currentUser";
import { hashPassword } from "./crypto";

type CurrentState= {success: boolean; error: boolean};


//CREATE UPDATE DELETE SUBJECTS
export const createSubject = async (
    currentState: CurrentState, 
    data: SubjectSchema
) =>{
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map((teacherId) => ({id: teacherId})),
                },
            },
        });
        // revalidatePath("/list/subjects");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const updateSubject = async (
    currentState: CurrentState, 
    data: SubjectSchema
) =>{
    try {
        await prisma.subject.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map((teacherId) => ({id: teacherId})),
                },
            },
        });
        // revalidatePath("/list/subjects");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const deleteSubject = async (
    currentState: CurrentState, 
    data: FormData
) =>{
    const id = data.get("id") as string;
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id),
            },
        });
        // revalidatePath("/list/subjects");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

//CREATE UPDATE DELETE CLASSES
export const createClass = async (
    currentState: CurrentState, 
    data: ClassSchema
) =>{
    try {
        await prisma.class.create({
            data,
        });
        // revalidatePath("/list/class");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const updateClass= async (
    currentState: CurrentState, 
    data: ClassSchema
) =>{
    try {
        await prisma.class.update({
            where: {
                id: data.id
            },
            data,
        });
        // revalidatePath("/list/class");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const deleteClass = async (
    currentState: CurrentState, 
    data: FormData
) =>{
    const id = data.get("id") as string;
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id),
            },
        });
        // revalidatePath("/list/class");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};


//CREATE UPDATE DELETE TEACHERS
export const createTeacher = async (
    currentState: CurrentState, 
    data: TeacherSchema
) =>{
    try {
        
        const user = await prisma.user.create({
            data: {
                email: data.email! ,
                passwordHash: await hashPassword(data.password!),
                role: 'teacher',
            },
        });
        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                email: data.email,
                surname: data.surname,
                phone: data.phone,
                img: data.img,
                address: data.address,
                sex: data.sex,
                birthday: data.birthdate,
                bloodType: data.bloodType,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) =>({
                        id: parseInt(subjectId),
                    })),
                },
            }
        });
        // revalidatePath("/list/teachers");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const updateTeacher= async (
    currentState: CurrentState, 
    data: TeacherSchema
    
) =>{
    if(!data.id){
        return {success: false, error: true}
    }
    try {
        await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                email: data.email! ,
                passwordHash: await hashPassword(data.password!),
                username: data.username,
            },
        });
        await prisma.teacher.update({
            where:{
                id: data.id
            },
            data: {
                username: data.username,
                name: data.name,
                email: data.email,
                surname: data.surname,
                phone: data.phone,
                img: data.img,
                address: data.address,
                sex: data.sex,
                birthday: data.birthdate,
                bloodType: data.bloodType,
                subjects: {
                    set: data.subjects?.map((subjectId: string) =>({
                        id: parseInt(subjectId),
                    })),
                },
            }
        });
        
        // revalidatePath("/list/teachers");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const deleteTeacher = async (
    currentState: CurrentState, 
    data: FormData
) =>{
    const id = data.get("id") as string;
    try {
        await clerkClient().users.deleteUser(id);
        await prisma.teacher.delete({
            where: {
                id: id,
            },
        });
        // revalidatePath("/list/teachers");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

//CREATE UPDATE DELETE STUDENTS


export const createStudent = async (
    currentState: CurrentState, 
    data: StudentSchema
) =>{
    try {
        const classItem = await prisma.class.findUnique({
            where:{id: data.classId },
            include: { _count: { select: {students: true}}},
        });
        if(classItem && classItem?.capacity === classItem?._count.students){
            return { success: false, error: true};
        }
        const user = await prisma.user.create({
            data: {
                email: data.email! ,
                passwordHash: await hashPassword(data.password!),
                username: data.username,
                role: 'student',
            },
        });
        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                email: data.email,
                surname: data.surname,
                phone: data.phone,
                img: data.img,
                address: data.address,
                sex: data.sex,
                birthday: data.birthdate,
                bloodType: data.bloodType,
                classId: data.classId,
                parentId: data.parentId,
            }
        });
        // revalidatePath("/list/students");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const updateStudent= async (
    currentState: CurrentState, 
    data: StudentSchema
    
) =>{
    if(!data.id){
        return {success: false, error: true}
    }
    try {
        const user = await clerkClient().users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && {pasword: data.password}),
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: {role: "student"}
        });
        await prisma.student.update({
            where:{
                id: data.id
            },
            data: {
                ...(data.password !== "" && {pasword: data.password}),
                username: data.username,
                name: data.name,
                email: data.email,
                surname: data.surname,
                phone: data.phone,
                img: data.img,
                address: data.address,
                sex: data.sex,
                birthday: data.birthdate,
                bloodType: data.bloodType,
                classId: data.classId,
                parentId: data.parentId,
            }
        });
        // revalidatePath("/list/students");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const deleteStudent = async (
    currentState: CurrentState, 
    data: FormData
) =>{
    const id = data.get("id") as string;
    try {
        await clerkClient().users.deleteUser(id);
        await prisma.student.delete({
            where: {
                id: id,
            },
        });
        // revalidatePath("/list/students");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};


//CREATE UPDATE DELETE EXAMS
export const createExam = async (
    currentState: CurrentState, 
    data: ExamSchema
) =>{
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata  as { role?: string })?.role;

    try {
        if(role === "teacher"){
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            });
            console.log("teacherLesson: ", teacherLesson);
            if(!teacherLesson) {
                return {success: false, error: true};
            };
        };
        await prisma.exam.create({
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });
        // revalidatePath("/list/exams");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const updateExam= async (
    currentState: CurrentState, 
    data: ExamSchema
    
) =>{
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata  as { role?: string })?.role;
    if(!data.id){
        return {success: false, error: true}
    }
    try {
        if(role === "teacher"){
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            });
            if(!teacherLesson) {
                return {success: false, error: true};
            };
        };
        await prisma.exam.update({
            where:{
                id: data.id,
            },
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });
        // revalidatePath("/list/exams");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const deleteExam = async (
    currentState: CurrentState, 
    data: FormData
) =>{
    const id = data.get("id") as string;
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata  as { role?: string })?.role;
    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? {lesson: {teacherId: userId! }} : {}),
            },
        });
        // revalidatePath("/list/exams  ");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};


//CREATE UPDATE DELETE ASSIGNMENTS
export const createAssignment = async (
    currentState: CurrentState, 
    data: AssignmentSchema
) =>{
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata  as { role?: string })?.role;

    try {
        if(role === "teacher"){
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            });
            console.log("teacherLesson: ", teacherLesson);
            if(!teacherLesson) {
                return {success: false, error: true};
            };
        };
        await prisma.assignment.create({
            data: {
                title: data.title,
                dueDate: data.dueDate,
                startDate: data.startDate,
                lessonId: data.lessonId,
            },
        });
        // revalidatePath("/list/assignments");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const updateAssignment= async (
    currentState: CurrentState, 
    data: AssignmentSchema
    
) =>{
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata  as { role?: string })?.role;
    if(!data.id){
        return {success: false, error: true}
    }
    try {
        if(role === "teacher"){
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            });
            if(!teacherLesson) {
                return {success: false, error: true};
            };
        };
        await prisma.assignment.update({
            where:{
                id: data.id,
            },
            data: {
                title: data.title,
                dueDate: data.dueDate,
                startDate: data.startDate,
                lessonId: data.lessonId,
            },
        });
        // revalidatePath("/list/assignments");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const deleteAssignment = async (
    currentState: CurrentState, 
    data: FormData
) =>{
    const id = data.get("id") as string;
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata  as { role?: string })?.role;
    try {
        await prisma.assignment.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? {lesson: {teacherId: userId! }} : {}),
            },
        });
        // revalidatePath("/list/assignments  ");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};



//CREATE UPDATE DELETE PARENTS
export const createParent = async (
    currentState: CurrentState, 
    data: ParentSchema
) =>{
    try {

        const user = await prisma.user.create({
            data: {
                email: data.email! ,
                passwordHash: await hashPassword(data.password!),
                role: 'parent',
            },
        });
        
        await prisma.parent.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                email: data.email,
                surname: data.surname,
                phone: data.phone,
                address: data.address,
                students: {
                    connect: data.students?.map((studentId: string) =>({
                        id: studentId,
                    })),
                },
            }
        });
        // revalidatePath("/list/Parents");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const updateParent= async (
    currentState: CurrentState, 
    data: ParentSchema
    
) =>{
    if(!data.id){
        return {success: false, error: true}
    }
    try {
        const user = await clerkClient().users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && {pasword: data.password}),
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: {role: "parent"}
        });
        await prisma.parent.update({
            where:{
                id: data.id
            },
            data: {
                ...(data.password !== "" && {pasword: data.password}),
                username: data.username,
                name: data.name,
                email: data.email,
                surname: data.surname,
                phone: data.phone,
                address: data.address,
                students: {
                    set: data.students?.map((subjectId: string) =>({
                        id: subjectId,
                    })),
                },
            }
        });
        // revalidatePath("/list/parents");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const deleteParent = async (
    currentState: CurrentState, 
    data: FormData
) =>{
    const id = data.get("id") as string;
    try {
        await clerkClient().users.deleteUser(id);
        await prisma.parent.delete({
            where: {
                id: id,
            },
        });
        // revalidatePath("/list/parents");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};



//CREATE UPDATE DELETE LESSON
export const createLesson = async (
    currentState: CurrentState, 
    data: LessonSchema
) =>{

    try {
        
        await prisma.lesson.create({
            data: {
                name: data.name,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: data.subjectId,
                classId: data.classId,
                teacherId: data.teacherId,
                exams: {
                    connect: data.exams?.map((examId: string) =>({
                        id: parseInt(examId),
                    })),
                },
                assignments: {
                    connect: data.assignments?.map((assignmentId: string) =>({
                        id: parseInt(assignmentId),
                    })),
                },
                attendances: {
                    connect: data.attendances?.map((attendanceId: string) =>({
                        id: parseInt(attendanceId),
                    })),
                },
            },
        });
        // revalidatePath("/list/lessons");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const updateLesson= async (
    currentState: CurrentState, 
    data: LessonSchema
    
) =>{
    
    try {
        
        await prisma.lesson.update({
            where:{
                id: data.id,
            },
            data: {
                name: data.name,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: data.subjectId,
                classId: data.classId,
                teacherId: data.teacherId,
                exams: {
                    connect: data.exams?.map((examId: string) =>({
                        id: parseInt(examId),
                    })),
                },
                assignments: {
                    connect: data.assignments?.map((assignmentId: string) =>({
                        id: parseInt(assignmentId),
                    })),
                },
                attendances: {
                    connect: data.attendances?.map((attendanceId: string) =>({
                        id: parseInt(attendanceId),
                    })),
                },
            },
        });
        // revalidatePath("/list/lessons");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};
export const deleteLesson = async (
    currentState: CurrentState, 
    data: FormData
) =>{
    const id = data.get("id") as string;
    try {
        await prisma.lesson.delete({
            where: {
                id: parseInt(id),
            },
        });
        // revalidatePath("/list/lessons  ");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};