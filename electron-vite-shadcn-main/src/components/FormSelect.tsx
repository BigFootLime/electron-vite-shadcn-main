import React, { useRef, useState } from "react";
import { Controller, Control, FieldError, RegisterOptions } from "react-hook-form";
import { X } from "lucide-react";
// Import shad components
import {
    Select,
    SelectContent,
    SelectContentWithoutPortal,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
// Import components
import FormLabel from "./FormLabel";
import CustomButton from "./CustomButton";

interface Option {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    name: string;
    control: Control<any>;
    classNameSelectTrigger?: string;
    disabled?: boolean;
    loading?: boolean;
    register: any;
    validation?: RegisterOptions;
    placeholder?: string;
    error?: FieldError;
    options?: Option[]; // Array of options
    light?: boolean; // New prop
    maxHeight?: number;
    noPortal?: boolean;
    noDelete?: boolean;
    children?: React.ReactNode[];
}

const FormSelect: React.FC<FormSelectProps> = ({
    label: propsLabel,
    name: propsName,
    control: propsControl,
    disabled: propsDisabled,
    loading: propsLoading,
    register: propsRegister,
    validation: propsValidation,
    error: propsError,
    options: propsOptions,
    light: propsLight,
    placeholder: propsPlaceholder,
    classNameSelectTrigger: propsClassNameSelectTrigger,
    maxHeight: propsMaxHeight,
    noPortal: propsNoPortal,
    noDelete: propsNoDelete,
    children: propsChildren = [],
}) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const SelectedContent = propsNoPortal ? SelectContentWithoutPortal : SelectContent;

    return (
        <Controller
            control={propsControl}
            name={propsName}
            render={({ field: { onChange, value, ref } }) => {
                // Handle focus when error occurs
                if (ref.current && propsError) {
                    ref.current.focus();
                }

                // Find selected and unselected items if options are used
                const selectedItem = propsOptions
                    ? propsOptions.find((option) => option.value === value)
                    : propsChildren?.find((item) => item.props?.value?.toString() === value);

                const unselectedItems = propsOptions
                    ? propsOptions.filter((option) => option.value !== value)
                    : propsChildren?.filter((item) => item.props?.value !== value);

                return (
                    <div className="w-full" ref={divRef}>
                        <FormLabel
                            label={propsLabel}
                            name={propsName}
                            required={propsValidation?.required}
                            className={`${propsLight ? "text-black" : ""}`}
                        />
                        {propsLoading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Select
                                ref={ref}
                                open={open}
                                onOpenChange={setOpen}
                                value={value}
                                onValueChange={onChange}
                                className="w-full rounded-md border border-black"
                                disabled={propsDisabled}
                                {...propsRegister(propsName, propsValidation)}
                            >
                                <SelectTrigger
                                    type="button"
                                    className={`w-full rounded-md border bg-gray-50 ${
                                        propsClassNameSelectTrigger || ""
                                    } ${propsError ? "!border-red-500" : "border-indigo-500 hover:border-indigo-500 focus:border-indigo-500"}`}
                                >
                                    {value ? (
                                        <SelectValue>{selectedItem?.label}</SelectValue>
                                    ) : (
                                        propsPlaceholder || "Sélectionner..."
                                    )}
                                </SelectTrigger>

                                <SelectedContent
                                    style={{
                                        maxWidth: `${divRef.current?.offsetWidth}px`,
                                    }}
                                >
                                    {selectedItem && (
                                        <SelectGroup className="scrollxs relative flex items-center overflow-auto border-b">
                                            <SelectItem value={selectedItem.value}>
                                                {selectedItem.label}
                                            </SelectItem>
                                            {!propsNoDelete && (
                                                <CustomButton
                                                    className="absolute right-2 h-6 w-6 cursor-pointer bg-transparent hover:!bg-slate-200"
                                                    fontSize="text-xs"
                                                    type="button"
                                                    icon={<X className="h-4 w-4 text-red-500" />}
                                                    onClick={() => {
                                                        onChange("");
                                                        setOpen(false);
                                                    }}
                                                />
                                            )}
                                        </SelectGroup>
                                    )}

                                    {unselectedItems && (
                                        <SelectGroup
                                            style={{ maxHeight: `${propsMaxHeight || 10}rem` }}
                                            className="scrollxs overflow-auto"
                                        >
                                            {propsOptions
                                                ? unselectedItems.map((option) => (
                                                      <SelectItem
                                                          key={option.value}
                                                          value={option.value}
                                                      >
                                                          {option.label}
                                                      </SelectItem>
                                                  ))
                                                : unselectedItems}
                                        </SelectGroup>
                                    )}
                                </SelectedContent>
                            </Select>
                        )}
                        {propsError && (
                            <span className="text-xs text-red-500">{propsError.message}</span>
                        )}
                    </div>
                );
            }}
        />
    );
};

export default FormSelect;
