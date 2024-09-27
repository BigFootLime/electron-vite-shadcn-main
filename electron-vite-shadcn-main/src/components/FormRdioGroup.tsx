import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import FormLabel from "./FormLabel";

function FormRadioGroup({
    label: propsLabel,
    name: propsName,
    options: propsOptions,
    className: propsClassName,
    disabled: propsDisabled,
    loading: propsLoading,
    register: propsRegister,
    validation: propsValidation,
    error: propsError,
    light: propsLight, // New prop
    orientation: propsOrientation = "vertical", // Orientation of the radio group
}) {
    return (
        <div className={`w-full ${propsClassName || ""}`}>
            <FormLabel
                label={propsLabel}
                name={propsName}
                required={propsValidation?.required}
                className={`${propsLight ? "mb-4 text-black" : ""}`} // Apply black text color if `light` is true
            />
            {propsLoading ? (
                <Skeleton className="h-10 w-full" />
            ) : (
                <RadioGroup
                    defaultValue={propsOptions[0]?.value}
                    name={propsName}
                    className={`flex ${
                        propsOrientation === "vertical" ? "flex-col space-y-2" : "space-x-2"
                    }`}
                >
                    {propsOptions.map((option) => (
                        <div
                            key={option.value}
                            className={`flex items-center ${
                                propsOrientation === "vertical" ? "space-x-2" : "space-y-2"
                            }`}
                        >
                            <RadioGroupItem
                                value={option.value}
                                id={`${propsName}_${option.value}`}
                                disabled={propsDisabled}
                                {...propsRegister(propsName, propsValidation)}
                            />
                            <Label htmlFor={`${propsName}_${option.value}`}>{option.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            )}
            {propsError && <span className="text-sm text-red-500">{propsError?.message}</span>}
        </div>
    );
}

export default FormRadioGroup;
