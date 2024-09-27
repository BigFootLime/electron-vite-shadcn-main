"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { ReactNode } from "react";

// Define prop types for full customization
interface ToastDemoProps {
    title?: string;
    description?: string;
    actionText?: string;
    altText?: string;
    duration?: number;
    swipeDirection?: "left" | "right" | "up" | "down";
    swipeThreshold?: number;
    label?: string;
    viewportLabel?: string;
    buttonLabel?: string;
    buttonVariant?: "outline" | "destructive"; // Customizable variant
    onActionClick?: () => void;
    customAction?: ReactNode;
}

export function ToastDemo({
    title = "Notification",
    description = "This is a customizable toast notification.",
    actionText = "Undo",
    altText = "Undo action",
    duration = 5000,
    swipeDirection = "right",
    swipeThreshold = 50,
    label = "Notification",
    viewportLabel = "Notifications (F8)",
    buttonLabel = "Show Toast",
    buttonVariant = "outline", // Default variant is outline, can be changed to destructive
    onActionClick,
    customAction,
}: ToastDemoProps) {
    const { toast } = useToast();

    return (
        <Button
            variant={buttonVariant}
            onClick={() => {
                toast({
                    title,
                    description,
                    duration,
                    swipeDirection,
                    swipeThreshold,
                    label,
                    action: customAction ? (
                        customAction
                    ) : (
                        <ToastAction altText={altText} onClick={onActionClick || (() => {})}>
                            {actionText}
                        </ToastAction>
                    ),
                });
            }}
        >
            {buttonLabel}
        </Button>
    );
}
