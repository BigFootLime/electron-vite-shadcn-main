import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/FormInput";
import FormTextArea from "../../components/FormTextArea";
import FormSelect from "../../components/FormSelect";
import FormAutoComplete from "../../components/FormAutoComplete";
import { Button } from "@/components/ui/button";
import { BadgeEuro, Cog, HandCoins, ReceiptEuro, Save, Trash2 } from "lucide-react";
import FormRadioGroup from "../../components/FormRdioGroup";
import CustomDialog from "../../components/CustomDialog";
import { useEffect, useState } from "react";
import GammeFabricationDevisForm from "../gamme_fabrication/gammeFabricationDevis";

export default function CreateDevisForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            client_id: "",
            date_creation: new Date().toISOString().split("T")[0],
            statut: "En cours",
            taux_tva: 20.0,
        },
    });

    const onSubmit = (data) => {
        console.log(data);
        // Traitement du formulaire ici
    };

    const clientOptions = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "blueberry", label: "Blueberry" },
        { value: "grapes", label: "Grapes" },
        { value: "pineapple", label: "Pineapple" },
    ];
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="h-full">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="h-full w-full rounded-lg bg-neutral-100 p-6 sm:p-8 md:p-10"
            >
                <div className="grid grid-cols-1 gap-4">
                    <div className="col-span-1">
                        {/* <FormAutoComplete
              label="Client"
              name="client_id"
              placeholder="Selectionner un client"
              options={clientOptions}
              register={register}
              validation={{ required: "Vueillez selectionner un client" }}
              error={errors.client_id}
              light={true}
            /> */}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormInput
                            light={true}
                            label="Date de création"
                            name="date_creation"
                            type="date"
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.date_creation}
                        />

                        <FormInput
                            light={true}
                            label="Date Limite de validité"
                            name="date_validite"
                            type="date"
                            register={register}
                            error={errors.date_validite}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormSelect
                            light={true}
                            label="Statut"
                            name="statut"
                            options={[
                                { value: "En cours", label: "En cours" },
                                { value: "Validé", label: "Validé" },
                                { value: "Annulé", label: "Annulé" },
                            ]}
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.statut}
                        />

                        <FormInput
                            light={true}
                            label="Délai de livraison"
                            name="delai_livraison"
                            type="date"
                            register={register}
                            error={errors.delai_livraison}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormInput
                            light={true}
                            label="Interlocuteur"
                            name="interlocuteur"
                            type="text"
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.interlocuteur}
                        />

                        <FormInput
                            light={true}
                            label="Taux TVA (%)"
                            name="taux_tva"
                            type="number"
                            step="0.01"
                            register={register}
                            validation={{ required: "Ce champ est requis" }}
                            error={errors.taux_tva}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <FormInput
                            light={true}
                            label="Remise (€)"
                            name="remise"
                            type="number"
                            step="0.01"
                            register={register}
                            error={errors.remise}
                        />
                    </div>

                    <FormRadioGroup
                        label="Conditions de Paiement"
                        name="conditions_paiement"
                        options={[
                            { value: "debit", label: "Debit" },
                            { value: "encaissement", label: "Encaissement" },
                            { value: "non defini", label: "Non défini" },
                        ]}
                        register={register}
                        validation={{ required: "Ce champ est obligatoire" }}
                        error={errors.conditions_paiement}
                        orientation="horizontal"
                        light={true}
                        className={""}
                    />

                    <div>
                        <FormTextArea
                            light={true}
                            label="Conditions spéciales"
                            name="conditions_speciales"
                            register={register}
                            error={errors.conditions_speciales}
                        />
                    </div>

                    <div>
                        <FormTextArea
                            light={true}
                            label="Remarques"
                            name="remarques"
                            register={register}
                            error={errors.remarques}
                        />
                    </div>
                </div>
                <div className="my-4 border-b border-neutral-800"></div>
                <div className="mt-6 flex flex-col justify-between md:flex-row">
                    <CustomDialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        triggerLabel="Gamme de Fabrication"
                        triggerVariant="outline"
                        title="Gamme de Fabrication"
                        description="Ajouter une gamme de fabrication à ce devis. Veuillez remplir les informations nécessaires."
                        size="w-full max-w-3xl sm:max-w-5xl lg:max-w-4xl xl:max-w-6xl"
                        backgroundColor="bg-gray-900"
                        titleColor="text-white"
                        // onSaveChanges={handleSaveChanges}
                        triggerClassName="bg-neutral-500 text-white py-2 px-4 rounded-lg hover:bg-primary/90 hover:text-white"
                        triggerIcon={<Cog className="mr-2" />}
                    >
                        <GammeFabricationDevisForm />
                    </CustomDialog>
                    <Button className="mt-4 rounded-lg bg-neutral-500 px-4 py-2 text-white md:mt-0">
                        <BadgeEuro className="mr-2" />
                        Nomenclature d'Achat
                    </Button>
                    <Button className="mt-4 rounded-lg bg-neutral-500 px-4 py-2 text-white md:mt-0">
                        <ReceiptEuro className="mr-2" />
                        Récaptitulatif
                    </Button>
                    <Button className="mt-4 rounded-lg bg-neutral-500 px-4 py-2 text-white md:mt-0">
                        <HandCoins className="mr-2" />
                        Offres
                    </Button>
                </div>
                <div className="my-4 border-b border-neutral-800"></div>
                <div className="mt-6 flex flex-col justify-between md:flex-row">
                    <Button
                        type="submit"
                        className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-white md:mt-0"
                    >
                        <Save className="mr-2" />
                        Enregistrer
                    </Button>
                    <Button
                        variant={"destructive"}
                        className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white md:mt-0"
                    >
                        <Trash2 className="mr-2" />
                        Supprimer
                    </Button>
                </div>
            </form>
        </div>
    );
}
