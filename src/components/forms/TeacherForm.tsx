"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Result } from "postcss";


const TeacherForm = ({
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
    const [img, setImg] = useState<any>()

    const {
        register, handleSubmit, formState: { errors },
    } = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema),
    });
    //AFTER REACT 19 IT'LL BE USEACTION
    const [state, formAction] = useFormState(type==="create" ? createTeacher : updateTeacher, {
        success: false,
        error: false,
    });
    const onSubmit =handleSubmit((data)=>{
        formAction({...data, img: img?.secure_url });        
    });
    const router = useRouter();
    useEffect(() =>{
        if(state.success){
            toast(`Teacher has been ${type==="create" ? "create" : "update"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    const { subjects } = relatedData ?? {};

    return (
        <form className=" flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type==="create" ? "Create a new Teacher" : "Update the Teacher"}</h1>
            <div className="flex justify-between gap-4 flex-wrap ">
                {/* <span>Authentication information</span> */}
                <InputField 
                    label="Username" 
                    name= "username"
                    defaultvalue={data?.username} 
                    register={register} 
                    error={errors?.username}
                />
                <InputField 
                    label="Email" 
                    name= "email"
                    defaultvalue={data?.email} 
                    register={register} 
                    error={errors?.email}
                />
                <InputField 
                    label="Password" 
                    name= "password"
                    defaultvalue={data?.password} 
                    register={register} 
                    error={errors?.password}
                />
                {/* <span>Personal Information</span> */}
                <InputField 
                    label="First Name" 
                    name= "name"
                    defaultvalue={data?.name} 
                    register={register} 
                    error={errors?.name}
                />
                <InputField 
                    label="Last Name" 
                    name= "surname"
                    defaultvalue={data?.surname} 
                    register={register} 
                    error={errors?.surname}
                />
                <InputField 
                    label="Phone" 
                    name= "phone"
                    defaultvalue={data?.phone} 
                    register={register} 
                    error={errors?.phone}
                />
                <InputField 
                    label="Address" 
                    name= "address"
                    defaultvalue={data?.address} 
                    register={register} 
                    error={errors?.address}
                />
                <InputField 
                    label="Bloodtype" 
                    name= "bloodType"
                    defaultvalue={data?.bloodType} 
                    register={register} 
                    error={errors?.bloodType}
                />
                <InputField 
                    label="Birthdate" 
                    name= "birthdate"
                    defaultvalue={data?.birthdate?.toISOString().split("T")[0]} 
                    register={register} 
                    error={errors?.birthdate}
                    type="date"
                />
                <InputField 
                    label="Bloodtype" 
                    name= "bloodType"
                    defaultvalue={data?.bloodType} 
                    register={register} 
                    error={errors?.bloodType}
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
                    <label className="text-xs text-gray-500">Sex</label>
                    <select 
                        {...register("sex")} 
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
                        defaultValue={data?.sex}
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                    {errors.sex?.message &&(
                        <p className="text-red-600 text-xs">  {errors.sex?.message.toString()} </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Subjects</label>
                    <select 
                        multiple
                        {...register("subjects")} 
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
                        defaultValue={data?.subjects}
                    >
                        {subjects.map((subject: {id: number, name: string})=>(
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                       
                    </select>
                    {errors.subjects?.message &&(
                        <p className="text-red-600 text-xs">  {errors.subjects?.message.toString()} </p>
                    )}
                </div>
                {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="img">
                        <Image src="/upload.png" alt="" width={28} height={28} />
                        <span>Upload a photo</span>
                    </label>
                    <input type="file" id="img" {...register("img")} className="hidden"/>
                    {errors.img?.message &&(
                        <p className="text-red-600 text-xs">  {errors.img?.message.toString()} </p>
                    )}
                </div> */}

                <CldUploadWidget uploadPreset="schools" onSuccess={(result,{widget})  =>{
                    setImg(result.info)
                    widget.close()
                }} >
                    {({ open }) =>{
                        return(
                            <div className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                                onClick={()=> open()}
                            >
                                <Image src="/upload.png" alt="" width={28} height={28} />
                                <span>Upload a photo</span>
                            </div>
                        )
                    }}
                </CldUploadWidget>
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
export default TeacherForm;
