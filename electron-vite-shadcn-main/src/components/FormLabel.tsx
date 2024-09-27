// Import libs
import React from "react";
// Import shad components
import { Label } from "@/components/ui/label";

function FormLabel({
    label: propsLabel,
    name: propsName,
    required: propsRequired,
    className: propsClassName,
}) {
    return !propsLabel ? null : (
        <Label
            htmlFor={propsName}
            className={`m-0 max-w-full truncate text-sm text-white hover:relative hover:z-50 hover:max-w-max hover:pr-2 ${propsClassName}`}
        >
            {propsLabel} {propsRequired ? <span className="!text-orange-500">*</span> : null}
        </Label>
    );
}

export default FormLabel;
