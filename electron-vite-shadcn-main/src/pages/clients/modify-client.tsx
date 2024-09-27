import { Button } from "@/components/ui/button";
import FormInput from "../../components/FormInput";
import { Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormAutocomplete from "../../components/FormAutoComplete";
import { useToast } from "@/hooks/use-toast"; // Import useToast hook

export default function ModifyClientForm({ clientId, onModifyClient }) {
    const { toast } = useToast(); // Initialize the toast
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [clientIds, setClientIds] = useState([]); // For autocomplete suggestions
    const [reglementOptions, setReglementOptions] = useState(["VIR", "CH45J", "VIR60"]); // Existing options for Règlement

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            client_id: "",
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

    useEffect(() => {
        const fetchClientData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/clients/${clientId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            setValue(key, data[key]);
                        }
                    }
                    // Assuming client IDs and Règlement options come from the same API
                    setClientIds(data.clientIds || []);
                    setReglementOptions(data.reglements || reglementOptions);
                } else {
                    setFetchError("Failed to load client data");
                }
            } catch (error) {
                console.error("Error fetching client data:", error);
                setFetchError("An error occurred while fetching client data");
            } finally {
                setLoading(false);
            }
        };

        if (clientId) {
            fetchClientData();
        }
    }, [clientId, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Client updated:", result);
                onModifyClient(result);

                // Show success toast
                toast({
                    title: "Client Modifié",
                    description: "Le client a été modifié avec succès.",
                    className: "bg-green-600 text-white",
                });
            } else {
                console.error("Failed to update client");

                // Show error toast
                toast({
                    title: "Erreur de Modification",
                    description: "Erreur lors de la modification du client.",
                    variant: "destructive", // Use destructive variant for errors
                });
            }
        } catch (error) {
            console.error("Error:", error);

            // Show network error toast
            toast({
                title: "Network Error",
                description: "Une erreur réseau est survenue.",
                variant: "destructive",
            });
        } finally {
            // Add an artificial delay before setting loading to false
            setTimeout(() => {
                setLoading(false);
            }, 2000); // Delay of 2 seconds
        }
    };

    return (
        <div className="h-full">
            {fetchError && <p className="text-red-600">{fetchError}</p>}
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
                            loading={loading}
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
                        loading={loading}
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
                            loading={loading}
                        />
                        <FormInput
                            light={true}
                            label="Code Postal"
                            name="code_postal"
                            type="text"
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.code_postal}
                            loading={loading}
                        />
                        <FormInput
                            light={true}
                            label="Pays"
                            name="pays"
                            type="text"
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.pays}
                            loading={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormInput
                            light={true}
                            label="SIRET"
                            name="siret"
                            type="text"
                            register={register}
                            error={errors.siret}
                            loading={loading}
                        />
                        <FormInput
                            light={true}
                            label="Téléphone"
                            name="telephone"
                            type="text"
                            register={register}
                            error={errors.telephone}
                            loading={loading}
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
                            loading={loading}
                        />
                        <FormInput
                            light={true}
                            label="Compte Tiers"
                            name="compte_tiers"
                            type="text"
                            register={register}
                            error={errors.compte_tiers}
                            loading={loading}
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
                            loading={loading}
                        />
                    </div>

                    <FormInput
                        light={true}
                        label="Contact Principal"
                        name="contact_principal"
                        type="text"
                        register={register}
                        error={errors.contact_principal}
                        loading={loading}
                    />
                </div>

                <div className="my-12 border-b border-neutral-800"></div>

                <div className="mt-6 flex flex-col justify-between md:flex-row">
                    <Button
                        type="submit"
                        className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-white md:mt-0"
                        disabled={loading}
                    >
                        <Save className="mr-2" />
                        {loading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                    {/* <Button
            variant={"destructive"}
            className="bg-red-500 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
            disabled={loading}
          >
            <Trash2 className="mr-2" />
            Supprimer
          </Button> */}
                </div>
            </form>
        </div>
    );
}
