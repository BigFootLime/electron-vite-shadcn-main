import React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface CustomSheetProps {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    triggerLabel?: string;
    triggerVariant?: string;
    title?: string;
    description?: string;
    onSaveChanges?: () => void;
    size?: string;
    closeOnSave?: boolean;
    children?: React.ReactNode;
    backgroundColor?: string; // New prop for background color
    titleColor?: string; // New prop for title color
    showTrigger?: boolean; // New prop to control trigger visibility
}

const CustomSheet: React.FC<CustomSheetProps> = ({
    defaultOpen = false,
    open,
    onOpenChange,
    modal = true,
    triggerLabel = "Open",
    triggerVariant = "outline",
    title = "Edit profile",
    description = "Make changes to your profile here. Click save when you're done.",
    size = "w-[50%]",
    children,
    backgroundColor = "bg-neutral-50",
    titleColor = "text-black",
    showTrigger = true, // Default to true
}) => {
    return (
        <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange} modal={modal}>
            {showTrigger && (
                <SheetTrigger asChild>
                    <Button variant={triggerVariant}>{triggerLabel}</Button>
                </SheetTrigger>
            )}
            <SheetContent className={`${size} ${backgroundColor}`}>
                <SheetHeader>
                    <SheetTitle className={`${titleColor}`}>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                {/* Separator */}
                <div className="my-4 border-b border-neutral-300"></div>
                <div className="grid gap-4 py-4">{children}</div>
                <SheetFooter></SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default CustomSheet;
