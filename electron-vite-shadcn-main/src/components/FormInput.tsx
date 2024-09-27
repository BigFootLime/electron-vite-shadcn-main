import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import FormLabel from "./FormLabel";
import React from "react";

function FormInput({
    label,
    name,
    type = "text",
    classNameInput = "",
    disabled = false,
    loading = false,
    register,
    validation = {},
    placeholder = "",
    error,
    light = false, // Default to false
    maxLength, // Make maxLength dynamic, no default set
    onKeyPress, // Dynamic onKeyPress handler
    onChange, // Dynamic onChange handler
}) {
    // Default onKeyPress handler to allow only numeric input if none is provided
    const handleKeyPress = (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault(); // Prevent non-numeric characters
        }
    };

    return (
        <div className="w-full">
            <FormLabel
                label={label}
                name={name}
                required={validation?.required}
                className={`${light ? "text-black" : ""}`} // Apply black text color if `light` is true
            />
            {loading ? (
                <Skeleton className="h-10 w-full" />
            ) : (
                <Input
                    id={name}
                    disabled={disabled}
                    type={type}
                    {...register(name, validation)}
                    className={`w-full rounded-md border border-indigo-500 hover:border-indigo-500 focus:border-indigo-500 ${classNameInput} ${error ? "!border-red-500" : ""}`}
                    placeholder={placeholder}
                    maxLength={maxLength} // Dynamic maxLength
                    onKeyPress={
                        onKeyPress ||
                        (type === "text" && maxLength === 14 ? handleKeyPress : undefined)
                    } // Use custom or default onKeyPress
                    onChange={onChange} // Dynamic onChange handler
                />
            )}
            {error && <span className="text-sm text-red-500">{error?.message}</span>}
        </div>
    );
}

export default FormInput;
