import React from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Type definitions for props
interface CommandItem {
    name: string;
    value: string;
    key?: string;
}

interface CommandGroup {
    props: Record<string, any>;
    [key: string]: any;
}

interface ItemsProps {
    [key: number]: {
        commandGroup: CommandGroup;
    };
}

interface FormAutocompleteButtonProps {
    disabled?: boolean;
    simple?: boolean;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    items: ItemsProps;
    setOpen: (open: boolean) => void;
    error?: boolean;
}

const FormAutocompleteButton: React.FC<FormAutocompleteButtonProps> = ({
    disabled: propsDisabled,
    simple: propsSimple,
    value: propsValue,
    onChange: propsOnChange,
    items: propsItems,
    setOpen: propsSetOpen,
    error: propsError,
}) => {
    function GetValue(value: string): string | undefined {
        return Object.keys(propsItems)
            .map((key) => {
                const { commandGroup } = propsItems[key];
                return Object.keys(commandGroup)
                    .filter((item) => item !== "props")
                    .map((item) => {
                        const { commandItem } = commandGroup[item];
                        return commandItem;
                    });
            })
            .flat()
            .find((item) => item.value === value)?.name;
    }

    return (
        <Button
            type="button"
            className={`mb-1 flex w-full justify-between gap-3 bg-gray-50 !px-4 py-2 ${
                propsError ? "!border-red-500" : ""
            }`}
            variant="outline"
            disabled={propsDisabled}
            onClick={() => propsSetOpen(true)}
        >
            <div className="scrollxs flex flex-row gap-1 overflow-auto py-1">
                {propsSimple && (
                    <Label className="m-0 cursor-pointer text-black">
                        {GetValue(propsValue as string) || "Sélectionner ..."}
                    </Label>
                )}

                {!propsSimple && Array.isArray(propsValue) && (
                    <>
                        {propsValue.map((item) => (
                            <Button
                                key={item}
                                className="h-7 cursor-pointer rounded border border-slate-200 bg-transparent px-2 py-1 hover:!bg-slate-300"
                                fontSize="text-xs"
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    propsOnChange(propsValue.filter((i) => i !== item));
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Label className="m-0 max-w-[150px] cursor-pointer truncate text-xs text-black hover:!max-w-full">
                                        {GetValue(item)}
                                    </Label>
                                    <X className="h-4 w-4 text-red-500" />
                                </div>
                            </Button>
                        ))}
                        {propsValue.length === 0 && (
                            <Label className="m-0 cursor-pointer text-black">
                                Sélectionner ...
                            </Label>
                        )}
                    </>
                )}
            </div>
            <ChevronDown className="h-4 w-4 text-[#7b7e87]" />
        </Button>
    );
};

export default FormAutocompleteButton;
