import { FieldError } from "react-hook-form";

type InputFieldProps ={
    label: string;
    type?: string;
    register: any;
    name: string;
    defaultvalue?: string;
    error?: FieldError;
    hidden?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
const InputField = ({
    label, type="text", register, name,defaultvalue, error, hidden,inputProps
}:InputFieldProps) =>{
    return(
        <div className={ hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
            <label className="text-xs text-gray-500">{label}</label>
            <input 
                type={type} 
                {...register(name)} 
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
                {...inputProps}
                defaultValue={defaultvalue}
            />
            {error?.message && 
                <p className="text-red-600 text-xs">  {error?.message.toString()} </p>
            }
        </div>
    )
};
export default InputField;