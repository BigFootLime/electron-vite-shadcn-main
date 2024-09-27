import React, { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Type definitions for props
interface CustomButtonProps {
    className?: string;
    text?: string;
    name?: string;
    type?: "button" | "submit" | "reset";
    variant?: "default" | "secondary" | "destructive" | "outline";
    onClick?: () => void;
    icon?: ReactNode;
    loading?: boolean;
    disabled?: boolean;
    fontSize?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    className: propsClassName,
    text: propsText,
    name: propsName,
    type: propsType = "button",
    variant: propsVariant,
    onClick: propsOnClick,
    icon: propsIcon,
    loading: propsLoading = false,
    disabled: propsDisabled = false,
    fontSize: propsFontSize,
}) => {
    return (
        <Button
            className={propsClassName}
            name={propsName}
            variant={propsVariant}
            type={propsType}
            size={propsIcon && !propsText ? "icon" : "default"}
            onClick={propsOnClick}
            disabled={propsDisabled || propsLoading}
        >
            {propsLoading ? (
                <>
                    <Loader2 className={`h-4 w-4 animate-spin${propsText ? " mr-2" : ""}`} />
                    {propsText}
                </>
            ) : (
                <>
                    {propsIcon}
                    <span className={propsFontSize || ""}>{propsText}</span>
                </>
            )}
        </Button>
    );
};

export default CustomButton;

/*  
Props to be used with this component:             
                                                  
    className: string  
    text: string
    variant: default, secondary, destructive, outline
    onClick: function
    icon: component
    loading: boolean                                  
    disabled: boolean
    
    Example:

    <CustomButton
        className="w-full"
        text="Sign in"
        variant="default"
        onClick={() => console.log("Clicked")}
        icon={<Icon name="user" />}
        loading={false}
        disabled={false}
    />
    
*/
