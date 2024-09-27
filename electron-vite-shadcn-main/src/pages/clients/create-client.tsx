import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/FormInput";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import FormAutocomplete from "../../components/FormAutoComplete";
import { useToast } from "@/hooks/use-toast";

export default function CreateClientForm({ onAddClient }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false); // Add loading state
    const [reglementOptions, setReglementOptions] = useState(["VIR", "CH45J", "VIR60"]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nom: "",
            rue: "",
            localite: "",
            code_postal: "",
            pays: "",
            siret: "",
            telephone: "",
            telecopie: "",
            compte_tiers: "",
            reglement: "",
            groupe_financier: "",
            contact_principal: "",
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/clients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Client created:", result);

                // Show success toast
                toast({
                    title: "Client Ajouté",
                    description: "Le client a été ajouté avec succès.",
                    className: "bg-green-600 text-white",
                });

                onAddClient(result);
            } else {
                console.error("Failed to create client");

                // Show error toast
                toast({
                    title: "Erreur de Création",
                    description: "Erreur lors de la création du client.",
                    variant: "destructive", // Use destructive variant for errors
                });
            }
        } catch (error) {
            console.error("Error:", error);

            // Show network error toast
            toast({
                title: "Network Error",
                description: "An error occurred while trying to create the client.",
                variant: "destructive",
            });
        } finally {
            // Introduce an artificial delay of 2 seconds
            setTimeout(() => {
                setLoading(false); // Set loading to false after delay
            }, 2000); // Delay time in milliseconds (e.g., 2000ms = 2 seconds)
        }
    };

    return (
        <div className="h-full">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="h-full w-full rounded-lg bg-neutral-300 p-6 sm:p-8 md:p-10"
            >
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormInput
                            light={true}
                            label="Nom Client"
                            name="nom"
                            type="text"
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.nom}
                            loading={loading} // Pass loading prop
                        />
                    </div>

                    <FormInput
                        light={true}
                        label="Rue"
                        name="rue"
                        type="text"
                        register={register}
                        validation={{ required: "Ce champ est requis" }}
                        error={errors.rue}
                        loading={loading} // Pass loading prop
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FormInput
                            light={true}
                            label="Ville"
                            name="localite"
                            type="text"
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.localite}
                            loading={loading} // Pass loading prop
                        />
                        <FormInput
                            light={true}
                            label="Code Postal"
                            name="code_postal"
                            type="text"
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.code_postal}
                            loading={loading} // Pass loading prop
                        />
                        <FormInput
                            light={true}
                            label="Pays"
                            name="pays"
                            type="text"
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.pays}
                            loading={loading} // Pass loading prop
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormInput
                            light={true}
                            label="SIRET"
                            name="siret"
                            type="text"
                            validation={{
                                required: "Ce champ est requis",
                                pattern: {
                                    value: /^[0-9]{14}$/,
                                    message: "SIRET invalide",
                                },
                            }}
                            register={register}
                            error={errors.siret}
                            loading={loading}
                            maxLength={19} // Set maxLength dynamically
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault(); // Custom handler to prevent non-numeric characters
                                }
                            }}
                            onChange={(e) => {
                                // Custom change logic if needed
                                console.log("Input changed:", e.target.value);
                            }}
                        />

                        <FormInput
                            light={true}
                            label="Téléphone"
                            name="telephone"
                            type="text"
                            register={register}
                            error={errors.telephone}
                            loading={loading} // Pass loading prop
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormInput
                            light={true}
                            label="Télécopie"
                            name="telecopie"
                            type="text"
                            register={register}
                            error={errors.telecopie}
                            loading={loading} // Pass loading prop
                        />
                        <FormInput
                            light={true}
                            label="Compte Tiers"
                            name="compte_tiers"
                            type="text"
                            register={register}
                            error={errors.compte_tiers}
                            loading={loading} // Pass loading prop
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormAutocomplete
                            simple
                            label="Règlement"
                            name="reglement"
                            control={control}
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.reglement}
                            loading={loading}
                            items={{
                                0: {
                                    commandGroup: {
                                        props: {
                                            heading: "Options de Règlement",
                                        },
                                        ...reglementOptions.reduce((acc, option, index) => {
                                            acc[index] = {
                                                commandItem: {
                                                    name: option,
                                                    value: option,
                                                },
                                            };
                                            return acc;
                                        }, {}),
                                    },
                                },
                            }}
                        />

                        <FormInput
                            light={true}
                            label="Groupe Financier"
                            name="groupe_financier"
                            type="text"
                            register={register}
                            error={errors.groupe_financier}
                            loading={loading} // Pass loading prop
                        />
                    </div>

                    <FormInput
                        light={true}
                        label="Contact Principal"
                        name="contact_principal"
                        type="text"
                        register={register}
                        error={errors.contact_principal}
                        loading={loading} // Pass loading prop
                    />
                </div>

                <div className="my-12 border-b border-neutral-800"></div>

                <div className="mt-6 flex flex-col justify-between md:flex-row">
                    <Button
                        type="submit"
                        className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-white md:mt-0"
                        disabled={loading} // Disable button when loading
                    >
                        <Save className="mr-2" />
                        Enregistrer
                    </Button>
                </div>
            </form>
        </div>
    );
}
