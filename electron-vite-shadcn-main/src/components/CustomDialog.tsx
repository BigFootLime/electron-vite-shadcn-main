import React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomDialogProps {
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
    triggerClassName?: string;
    triggerIcon?: React.ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
    defaultOpen = false,
    open,
    onOpenChange,
    modal = true,
    triggerLabel = "Open",
    triggerVariant = "outline",
    title = "Edit profile",
    description = "Make changes to your profile here. Click save when you're done.",
    size = "sm:max-w-[425px]",
    children,
    backgroundColor = "bg-neutral-50",
    titleColor = "text-black",
    showTrigger = true, // Default to true
    //   onSaveChanges,
    //   closeOnSave = true,
    triggerClassName = "",
    triggerIcon,
}) => {
    //   const handleSaveChanges = () => {
    //     if (onSaveChanges) {
    //       onSaveChanges();
    //     }
    //     if (closeOnSave && onOpenChange) {
    //       onOpenChange(false);
    //     }
    //   };

    return (
        <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange} modal={modal}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button className={`${triggerClassName}`} variant={triggerVariant}>
                        {triggerIcon}
                        {triggerLabel}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className={`${size} ${backgroundColor}`}>
                <DialogHeader>
                    <DialogTitle className={`${titleColor}`}>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {/* Separator */}
                <div className="my-4 border-b border-neutral-300"></div>
                <div className="grid gap-4 py-4">{children}</div>
                <DialogFooter>
                    {/* <Button onClick={handleSaveChanges}>Save changes</Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CustomDialog;
