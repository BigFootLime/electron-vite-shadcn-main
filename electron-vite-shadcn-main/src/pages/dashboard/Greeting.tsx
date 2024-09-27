import React, { useEffect, useState } from "react";
import { BagroundGradientEffect } from "@/components/ui/gradient-background-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "../../lib/utils";
import { Loading } from "../../components/LoadingComponent";

export const Greeting = () => {
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                if (!token || !userId) {
                    throw new Error("Token or user ID is missing");
                }

                const response = await fetch(`http://localhost:3000/api/user-details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user details");
                }

                const result = await response.json();
                setFirstName(result.username);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div className="flex-center flex h-full items-center justify-center">
            <BagroundGradientEffect
                gradientBackgroundStart="rgb(108, 0, 162)"
                gradientBackgroundEnd="rgb(0, 17, 82)"
                firstColor="18, 113, 255"
                secondColor="221, 74, 255"
                thirdColor="100, 220, 255"
                fourthColor="200, 50, 50"
                fifthColor="180, 180, 50"
                pointerColor="140, 100, 255"
                size="80%"
                blendingValue="hard-light"
                interactive={true}
                className="your-custom-class"
                containerClassName="your-container-class"
            >
                <div className="flex flex-col items-center justify-center text-8xl">
                    <TextGenerateEffect
                        words={`Bonjour ${firstName}, nous preparons ton espace de travail...`}
                        className="animate-pulse text-8xl font-bold "
                        filter={true}
                        duration={0.5}
                    />
                    <Loading duration={5000} targetPath="/dashboard" />
                </div>
            </BagroundGradientEffect>
        </div>
    );
};
