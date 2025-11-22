"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {classSchema, ClassSchema } from "@/lib/formValidationSchemas";
import { createClass, updateClass } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const ClassForm = ({
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

    const {
        register, handleSubmit, formState: { errors },
    } = useForm<ClassSchema>({
        resolver: zodResolver(classSchema),
    });
    //AFTER REACT 19 IT'LL BE USEACTION
    const [state, formAction] = useFormState(type==="create" ? createClass : updateClass, {
        success: false,
        error: false,
    });
    const onSubmit =handleSubmit((data,relatedData)=>{
        console.log(data);
        console.log("type: ", type);
        formAction(data);
        console.log("After formAction");
        
        console.log("relatedData: ", relatedData);
        
    });
    const router = useRouter();
    useEffect(() =>{
        if(state.success){
            toast(`Class has been ${type==="create" ? "create" : "update"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    const { teachers, grades } = relatedData ?? {};

    return (
        <form className=" flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type==="create" ? "Create a new Class" : "Update the Class"}</h1>
            <div className="flex justify-between gap-4 flex-wrap ">
                <InputField 
                    label="Class name" 
                    name= "name"
                    defaultvalue={data?.name} 
                    register={register} 
                    error={errors?.name}
                />
                <InputField 
                    label="Capacity" 
                    name= "capacity"
                    defaultvalue={data?.capacity} 
                    register={register} 
                    error={errors?.capacity}
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
                    <label className="text-xs text-gray-500">Supervisors</label>
                    <select 
                        {...register("supervisorId")} 
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
                        defaultValue={data?.teachers}
                    >
                        {teachers?.map(
                            (teacher: {id:string; name:string; surname:string}) =>(
                                <option 
                                    key={teacher.id} 
                                    value={teacher.id}
                                    selected ={data && teacher.id === data.supervisorId}
                                >
                                    {teacher.name + " " + teacher.surname}
                                </option>
                            )
                        )}
                    </select>
                    {errors.supervisorId?.message && 
                        <p className="text-red-600 text-xs">  {errors.supervisorId?.message.toString()} </p>
                    }
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Grade</label>
                    <select 
                        {...register("gradeId")} 
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
                        defaultValue={data?.gradeId}
                    >
                        {grades?.map(
                            (grade: {id:number; level:number}) =>(
                                <option 
                                    key={grade.id} 
                                    value={grade.id}
                                    selected ={data && grade.id === data.gradeId}
                                >
                                    {grade.level }
                                </option>
                            )
                        )}
                    </select>
                    {errors.gradeId?.message && 
                        <p className="text-red-600 text-xs">  {errors.gradeId?.message.toString()} </p>
                    }
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
export default ClassForm;
