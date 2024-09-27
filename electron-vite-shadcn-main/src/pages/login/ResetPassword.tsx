import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import FormOTP from "../../components/FormOTP";
import FormInput from "../../components/FormInput";

interface PasswordResetFormValues {
    otp: string[];
    newPassword: string;
    email: string;
}

const PasswordReset: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const methods = useForm<PasswordResetFormValues>({
        mode: "all",
        defaultValues: {
            otp: ["", "", "", "", "", ""],
            newPassword: "",
            email: "",
        },
    });

    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = methods;

    useEffect(() => {
        if (location.state?.email) {
            setValue("email", location.state.email);
        }
    }, [location.state, setValue]);

    const onSubmit = async (data: PasswordResetFormValues) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const recoveryCode = data.otp.join("");

            const verifyResponse = await fetch("http://localhost:3000/api/verify-recovery-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ recoveryCode, email: data.email }),
            });

            if (!verifyResponse.ok) {
                throw new Error("Invalid recovery code");
            }

            const resetResponse = await fetch("http://localhost:3000/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newPassword: data.newPassword,
                    email: data.email,
                }),
            });

            if (!resetResponse.ok) {
                throw new Error("Failed to reset password");
            }

            setMessage("Password reset successfully. Please login with your new password.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-50">
                        Reset Password
                    </h2>
                </div>

                <div className="mt-10 flex flex-row justify-center sm:mx-auto sm:w-full sm:max-w-sm">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormOTP
                                label="OTP"
                                name="otp"
                                validation={{ required: true }}
                                loading={false}
                            />
                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                register={methods.register}
                                validation={{ required: "Email is required" }}
                                error={errors.email}
                                classNameInput="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:!ring-indigo-500 sm:text-sm sm:leading-6"
                                disabled
                            />
                            <FormInput
                                label="Nouveau Mot de Passe"
                                name="newPassword"
                                type="password"
                                register={methods.register}
                                validation={{ required: "Nouveau mot de passe est requis" }}
                                error={errors.newPassword}
                                classNameInput="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:!ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    disabled={loading}
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </div>

                {message && <div className="mt-4 text-center text-green-500">{message}</div>}
                {error && <div className="mt-4 text-center text-red-500">{error}</div>}
            </div>
        </div>
    );
};

export default PasswordReset;
