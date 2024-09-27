import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";

interface PasswordResetRequestFormValues {
    EmailForgetPassword: string;
}

const getDefaultValues = (): PasswordResetRequestFormValues => ({
    EmailForgetPassword: "",
});

const PasswordResetRequest: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const defaultValue = getDefaultValues();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordResetRequestFormValues>({
        mode: "all",
        defaultValues: defaultValue,
    });

    const onSubmit: SubmitHandler<PasswordResetRequestFormValues> = async (data) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("http://localhost:3000/api/request-password-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.EmailForgetPassword }),
            });

            if (!response.ok) {
                throw new Error("Demande non authorisée, veuillez verifier votre adresse email");
            }

            setMessage(
                "E-mail de récupération envoyé. Veuillez vérifier votre boîte de réception."
            );
            navigate("/reset-password", {
                state: { email: data.EmailForgetPassword },
            });
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
                        Demande de Reinitialisation de Mot de Passe
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <div className="mt-2">
                                <FormInput
                                    loading={loading}
                                    register={register}
                                    label={"Adresse email"}
                                    name="EmailForgetPassword"
                                    type="text"
                                    validation={{ required: "Adresse Email est requis" }}
                                    error={errors.EmailForgetPassword}
                                    classNameInput="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:!ring-indigo-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {message && <div className="text-sm text-green-500">{message}</div>}
                        {error && <div className="text-sm text-red-500">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Reinitialiser le Mot de Passe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetRequest;
