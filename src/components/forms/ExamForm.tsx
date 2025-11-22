"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { ExamSchema, examSchema} from "@/lib/formValidationSchemas";
import { createExam, updateExam} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const ExamForm = ({
    setOpen,
    type,
    data,
    relatedData,
}:{
    setOpen: Dispatch<SetStateAction<boolean>>;
    type: "create" | "update";
    data?: any;
    relatedData?: any;
}) =>{
    const [img, setImg] = useState<any>();

    const {
        register, handleSubmit, formState: { errors },
    } = useForm<ExamSchema>({
        resolver: zodResolver(examSchema),
    });
    //AFTER REACT 19 IT'LL BE USEACTION
    const [state, formAction] = useFormState(type==="create" ? createExam : updateExam, {
        success: false,
        error: false,
    });
    const onSubmit =handleSubmit((data)=>{
        formAction(data);        
    });
    const router = useRouter();
    useEffect(() =>{
        if(state.success){
            toast(`Exam has been ${type==="create" ? "create" : "update"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    const { lessons } = relatedData ?? {};

    return (
        <form className=" flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type==="create" ? "Create a new Exam" : "Update the Exam"}</h1>
            <div className="flex justify-between gap-4 flex-wrap ">
                <InputField 
                    label="Exam title" 
                    name= "title"
                    defaultvalue={data?.title} 
                    register={register} 
                    error={errors?.title}
                />
                <InputField 
                    label="Start Date" 
                    name= "startTime"
                    defaultvalue={data?.startTime} 
                    register={register} 
                    error={errors?.startTime}
                    type="datetime-local"
                />
                
                <InputField 
                    label="End Date" 
                    name= "endTime"
                    defaultvalue={data?.endTime} 
                    register={register} 
                    error={errors?.endTime}
                    type="datetime-local"
                />
                {data && (
                    <InputField 
                        label="Id" 
                        name= "id"
                        defaultvalue={data?.id} 
                        register={register} 
                        error={errors?.id}
                        hidden
                    />
                )}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Lesson</label>
                    <select 
                        {...register("lessonId")} 
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
                        defaultValue={data?.lessonId}
                    >
                        {lessons.map(
                            (lesson: {id: number; name: string}) =>{
                                <option key={lesson.id} value={lesson.name}>{lesson.name}</option>
                            })
                        }
                    </select>
                    {errors.lessonId?.message &&(
                        <p className="text-red-600 text-xs">  {errors.lessonId?.message.toString()} </p>
                    )}
                </div>
            </div>
            {state.error && (
                <span className="text-red-500">Something went wrong!</span>
            )}
            <button className="bg-blue-400 text-white rounded-md p-2">
                {type==="create" ? "Create" : "Update"}
            </button>
        </form>
    )
};
export default ExamForm;
