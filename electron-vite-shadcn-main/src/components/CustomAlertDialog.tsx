import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Define types for customization props
interface CustomAlertDialogProps {
    title?: string;
    description?: string;
    cancelText?: string;
    actionText?: string;
    onActionClick?: () => void;
    onCancelClick?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    actionButtonVariant?: string;
    cancelButtonVariant?: string;
    overlayBgColor?: string;
    contentBgColor?: string;
    contentBorderColor?: string;
    titleColor?: string;
    descriptionColor?: string;
    children: React.ReactNode;
}

// Customizable Alert Dialog Component
const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
    title = "Are you sure?",
    description = "This action cannot be undone.",
    cancelText = "Cancel",
    actionText = "Continue",
    onActionClick,
    onCancelClick,
    open,
    onOpenChange,
    actionButtonVariant = "default",
    cancelButtonVariant = "outline",
    overlayBgColor = "bg-black/80",
    contentBgColor = "bg-background",
    contentBorderColor = "border",
    titleColor = "text-lg font-semibold",
    descriptionColor = "text-sm text-muted-foreground",
    children, // Trigger button or custom components
}) => {
    return (
        <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialogPrimitive.Trigger asChild>{children}</AlertDialogPrimitive.Trigger>

            <AlertDialogPrimitive.Portal>
                {/* Overlay */}
                <AlertDialogPrimitive.Overlay
                    className={cn(
                        `fixed inset-0 z-50 ${overlayBgColor} data-[state=open]:animate-in data-[state=closed]:animate-out`
                    )}
                />

                {/* Content */}
                <AlertDialogPrimitive.Content
                    className={cn(
                        `fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 ${contentBorderColor} ${contentBgColor} p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out sm:rounded-lg`
                    )}
                >
                    <div className="flex flex-col space-y-2 text-center sm:text-left">
                        <AlertDialogPrimitive.Title className={cn(`${titleColor}`)}>
                            {title}
                        </AlertDialogPrimitive.Title>
                        <AlertDialogPrimitive.Description className={cn(`${descriptionColor}`)}>
                            {description}
                        </AlertDialogPrimitive.Description>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                        {/* Cancel Button */}
                        <AlertDialogPrimitive.Cancel asChild onClick={onCancelClick}>
                            <button
                                className={cn(buttonVariants({ variant: cancelButtonVariant }))}
                            >
                                {cancelText}
                            </button>
                        </AlertDialogPrimitive.Cancel>

                        {/* Action Button */}
                        <AlertDialogPrimitive.Action asChild onClick={onActionClick}>
                            <button
                                className={cn(buttonVariants({ variant: actionButtonVariant }))}
                            >
                                {actionText}
                            </button>
                        </AlertDialogPrimitive.Action>
                    </div>
                </AlertDialogPrimitive.Content>
            </AlertDialogPrimitive.Portal>
        </AlertDialogPrimitive.Root>
    );
};

export default CustomAlertDialog;
