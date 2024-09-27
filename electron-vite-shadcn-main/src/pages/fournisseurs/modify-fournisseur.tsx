import { Button } from "@/components/ui/button";
import FormInput from "../../components/FormInput";
import { Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormAutocomplete from "../../components/FormAutoComplete";
import { useToast } from "@/hooks/use-toast"; // Import useToast hook

export default function ModifySuppliertForm({ fournisseurID, onModifySupplier }) {
    const { toast } = useToast(); // Initialize the toast
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [supplierIds, setSuppliertIds] = useState([]); // For autocomplete suggestions
    const [reglementOptions, setReglementOptions] = useState([
        "VIR",
        "CH45J",
        "VIR60",
        "VIR30",
        "VIR45",
        "CHEQU",
        "CB",
        "PRE",
        "PRELE",
        "L45FM",
        "V45JF",
    ]); // Existing options for Règlement

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            fournisseur_id: "",
            nom_societe: "",
            adresse_ligne_1: "",
            adresse_ligne_2: "",
            adresse_ligne_3: "",
            localite: "",
            code_postal: "",
            pays: "",
            email: "",
            siret: "",
            telephone: "",
            telecopie: "",
            compte_tiers: "",
            reglement: "",
            contact_principal: "",
        },
    });

    useEffect(() => {
        const fetchClientData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:3000/api/suppliers/${fournisseurID}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            setValue(key, data[key]);
                        }
                    }
                    // Assuming client IDs and Règlement options come from the same API
                    setSuppliertIds(data.supplierIds || []);
                    setReglementOptions(data.reglements || reglementOptions);
                } else {
                    setFetchError("Failed to load supplier data");
                }
            } catch (error) {
                console.error("Error fetching supplier data:", error);
                setFetchError("An error occurred while fetching supplier data");
            } finally {
                setLoading(false);
            }
        };

        if (fournisseurID) {
            fetchClientData();
        }
    }, [fournisseurID, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/suppliers/${fournisseurID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Client updated:", result);
                onModifySupplier(result);

                // Show success toast
                toast({
                    title: "Fournisseur Modifié",
                    description: "Le fournisseur a été modifié avec succès.",
                    className: "bg-green-600 text-white",
                });
            } else {
                console.error("Failed to update client");

                // Show error toast
                toast({
                    title: "Erreur de Modification",
                    description: "Erreur lors de la modification du fournisseur.",
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
                    <FormInput
                        light={true}
                        label="N° Fournisseur"
                        name="fournisseur_id"
                        type="text"
                        register={register}
                        validation={{ required: "Ce champ est requis" }}
                        error={errors.fournisseur_id}
                        loading={loading}
                        disabled={true}
                    />
                    {/* Nom Société */}
                    <FormInput
                        light={true}
                        label="Nom Société"
                        name="nom_societe"
                        type="text"
                        register={register}
                        validation={{ required: "Ce champ est requis" }}
                        error={errors.nom_societe}
                        loading={loading}
                    />

                    {/* Adresse Ligne 1 */}
                    <FormInput
                        light={true}
                        label="Adresse Ligne 1"
                        name="adresse_ligne_1"
                        type="text"
                        register={register}
                        validation={{ required: "Ce champ est requis" }}
                        error={errors.adresse_ligne_1}
                        loading={loading}
                    />

                    {/* Adresse Ligne 2 */}
                    <FormInput
                        light={true}
                        label="Adresse Ligne 2"
                        name="adresse_ligne_2"
                        type="text"
                        register={register}
                        error={errors.adresse_ligne_2}
                        loading={loading}
                    />

                    {/* Adresse Ligne 3 */}
                    <FormInput
                        light={true}
                        label="Adresse Ligne 3"
                        name="adresse_ligne_3"
                        type="text"
                        register={register}
                        error={errors.adresse_ligne_3}
                        loading={loading}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Ville */}
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

                        {/* Code Postal */}
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

                        {/* Pays */}
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
                        {/* SIRET */}
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
                            maxLength={14}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />

                        {/* Téléphone */}
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
                        {/* Télécopie */}
                        <FormInput
                            light={true}
                            label="Télécopie"
                            name="telecopie"
                            type="text"
                            register={register}
                            error={errors.telecopie}
                            loading={loading}
                        />

                        {/* Compte Tiers */}
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

                    {/* Email */}
                    <FormInput
                        light={true}
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        validation={{
                            required: "Ce champ est requis",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Email invalide",
                            },
                        }}
                        error={errors.email}
                        loading={loading}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Règlement */}
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

                        {/* Contact Principal */}
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
                </div>

                <div className="my-12 border-b border-neutral-800"></div>

                <div className="mt-6 flex flex-col justify-between md:flex-row">
                    <Button
                        type="submit"
                        className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-white md:mt-0"
                        disabled={loading}
                    >
                        <Save className="mr-2" />
                        Enregistrer
                    </Button>
                </div>
            </form>
        </div>
    );
}
