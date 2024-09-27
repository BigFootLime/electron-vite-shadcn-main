import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/FormInput";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import FormAutoComplete from "../../components/FormAutoComplete";
import DeployableTable from "../../components/DeployableTable";

export default function GammeFabricationDevisForm() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limitPerPage = 15;
    const totalPages = Math.ceil(data.length / limitPerPage);

    useEffect(() => {
        const fetchDevisData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Token is missing");
                }

                const response = await fetch(`http://localhost:3000/api/devis`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch devis data");
                }

                const result = await response.json();
                const formattedResult = result.map((item) => ({
                    ...item,
                    date_creation: formatDate(item.date_creation),
                    date_validite: formatDate(item.date_validite),
                    delai_livraison: formatDate(item.delai_livraison),
                    total_ht: formatCurrency(item.total_ht),
                    total_ttc: formatCurrency(item.total_ttc),
                }));

                setData(formattedResult);
                console.log("Devis data:", formattedResult);
            } catch (error) {
                console.error("Error fetching devis data:", error);
            }
        };

        fetchDevisData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatCurrency = (amount) => {
        const formatter = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);

        return `${formatter}`;
    };

    const filters = [{ key: "all", label: "All", options: ["All", "Active", "Inactive"] }];

    const viewOptions = [
        { key: "grid", label: "Grid View", value: "grid" },
        { key: "list", label: "List View", value: "list" },
    ];

    const columnsConfig = [
        { key: "devis_id", label: "N° Devis" },
        { key: "version", label: "Version" },
        { key: "nom", label: "Nom Client" },
        { key: "date_creation", label: "Date de Création" },
        { key: "statut", label: "Statut" },
        { key: "delai_livraison", label: "Delai de Livraion" },
        { key: "interlocuteur", label: "Interlocuteur(-trice)" },
        { key: "total_ht", label: "Total HT" },
        { key: "total_ttc", label: "Total TTC" },
        { key: "conditions_speciales", label: "Conditions Speciales" },
        { key: "remarques", label: "Remarques" },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            piece_id: "",
            reference: "",
            designation: "",
        },
    });

    const onSubmit = (data) => {
        console.log(data);
        // Handle form submission logic here
    };

    return (
        <div className="flex h-full w-full items-center justify-center p-4 sm:p-6 md:p-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex h-full max-h-full w-full max-w-5xl flex-col justify-between rounded-lg bg-neutral-100 p-6 sm:p-8 md:p-10"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* <FormAutoComplete
            light={true}
            label="Piece ID"
            name="piece_id"
            type="text"
            register={register}
            validation={{ required: "Ce champ est requis" }}
            error={errors.piece_id}
          /> */}

                    <FormInput
                        light={true}
                        label="Référence"
                        name="reference"
                        type="text"
                        register={register}
                        validation={{ required: "Ce champ est requis" }}
                        error={errors.reference}
                    />

                    <FormInput
                        light={true}
                        label="Désignation"
                        name="designation"
                        type="text"
                        register={register}
                        validation={{ required: "Ce champ est requis" }}
                        error={errors.designation}
                    />
                </div>

                <div className="my-4 border-b border-neutral-800"></div>

                <DeployableTable
                    data={data}
                    columnsConfig={columnsConfig}
                    filters={filters}
                    viewOptions={viewOptions}
                    onFilterChange={(filter) => console.log("Filter changed to:", filter)}
                    onViewChange={(view) => console.log("View changed to:", view)}
                    onAddNew={(view) => console.log("View changed to:", view)}
                    onEdit={(row) => console.log("Edit row:", row)}
                    onDelete={(row) => console.log("Delete row:", row)}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                    limitPerPage={limitPerPage}
                    showActions={true}
                    tableHeight="h-64 md:h-86 overflow-auto" // Adjusted height
                    tableWidth="w-full"
                    containerHeight="flex-1" // Adjusted height
                    containerWidth="w-full"
                    tableTitle="GAMME DE FABRICATION"
                    tooltipContent="Ajouter un devis"
                />

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
