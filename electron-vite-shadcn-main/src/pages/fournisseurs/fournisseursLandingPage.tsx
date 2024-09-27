import React, { useState, useEffect } from "react";
import DeployableTable from "../../components/DeployableTable";
import { Badge } from "@/components/ui/badge";
import CustomSheet from "../../components/CustomSheet";
import { BanknoteIcon, CreditCardIcon, LandmarkIcon } from "lucide-react";
import CreateSupplierForm from "./create-fournisseur";
import ModifySuppliertForm from "./modify-fournisseur";
import CustomAlertDialog from "../../components/CustomAlertDialog"; // Import the custom alert dialog component
import { toast } from "@/hooks/use-toast";
import { CurrencyEuroIcon } from "@heroicons/react/24/outline";

const FournisseursLandingPage = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [formType, setFormType] = useState("add");
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Store filtered data
    const [currentPage, setCurrentPage] = useState(1);
    const limitPerPage = 55;
    const totalPages = Math.ceil(filteredData.length / limitPerPage); // Update to use filteredData
    const [loading, setLoading] = useState(true);
    const [selectedFilterColumn, setSelectedFilterColumn] = useState(""); // Track selected column for filtering
    const [filterValue, setFilterValue] = useState(""); // Track filter value

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete dialog
    const [supplierToDelete, setSupplierToDelete] = useState(null); // Track which client is being deleted

    useEffect(() => {
        const fetchClientData = async () => {
            setLoading(true); // Start loading
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Token is missing");
                }

                const response = await fetch(`http://localhost:3000/api/suppliers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch fournisseur data");
                }

                const result = await response.json();
                const formattedResult = result.map((item) => ({
                    ...item,
                    reglement: getReglementBadge(item.reglement),
                }));

                setData(formattedResult);
                setFilteredData(formattedResult); // Set initial data to filteredData
            } catch (error) {
                console.error("Error fetching client data:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchClientData();
    }, []);

    const getReglementBadge = (reglement) => {
        switch (reglement) {
            case "VIR":
                return (
                    <Badge className="bg-blue-500 px-4 py-1 hover:bg-blue-500">
                        <div className="flex flex-row text-white">
                            VIR <CreditCardIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "CHEQU":
                return (
                    <Badge className="bg-orange-500 px-4 py-1 hover:bg-green-500">
                        <div className="flex flex-row text-white">
                            CHEQU <BanknoteIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "CH45J":
                return (
                    <Badge className="bg-sky-500 px-4 py-1 hover:bg-sky-500">
                        <div className="flex flex-row text-white">
                            CH45J <BanknoteIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "V45JF":
                return (
                    <Badge className="bg-purple-500 px-4 py-1 hover:bg-purple-500">
                        <div className="flex flex-row text-white">
                            V45JF <BanknoteIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "VIR30":
                return (
                    <Badge className="bg-violet-500 px-4 py-1 hover:bg-violet-500">
                        <div className="flex flex-row text-white">
                            VIR30 <CreditCardIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "VIR45":
                return (
                    <Badge className="bg-emerald-500 px-4 py-1 hover:bg-emerald-500">
                        <div className="flex flex-row text-white">
                            VIR45 <CreditCardIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "PRE":
                return (
                    <Badge className="bg-teal-500 px-4 py-1 hover:bg-teal-500">
                        <div className="flex flex-row text-white">
                            PRE <LandmarkIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "PRELE":
                return (
                    <Badge className="bg-teal-500 px-4 py-1 hover:bg-teal-500">
                        <div className="flex flex-row text-white">
                            PRE <LandmarkIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "L45FM":
                return (
                    <Badge className="bg-cyan-500 px-4 py-1 hover:bg-cyan-500">
                        <div className="flex flex-row text-white">
                            L45FM <CurrencyEuroIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "CB":
                return (
                    <Badge className="bg-indigo-500 px-4 py-1 hover:bg-indigo-500">
                        <div className="flex flex-row text-white">
                            CB <CreditCardIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            default:
                return <Badge color="transparent">{reglement}</Badge>;
        }
    };

    const columnsConfig = [
        { key: "fournisseur_id", label: "N° Fournisseur", width: "160px" },
        { key: "nom_societe", label: "Nom Société", width: "200px" },
        { key: "adresse_ligne_1", label: "Adresse Ligne 1", width: "300px" },
        // { key: "adresse_ligne_2", label: "Adresse Ligne 2", width: "300px" },

        { key: "localite", label: "Ville", width: "250px" },
        { key: "code_postal", label: "Code Postal", width: "100px" },
        { key: "pays", label: "Pays", width: "120px" },
        { key: "siret", label: "SIRET", width: "200px" },
        { key: "telephone", label: "Téléphone", width: "180px" },
        { key: "telecopie", label: "Télécopie", width: "180px" },
        { key: "compte_tiers", label: "Compte Tiers", width: "190px" },
        { key: "email", label: "Email", width: "250px" },
        { key: "reglement", label: "Règlement", width: "150px" },
    ];

    // Define filters for ID, Name, Phone Number
    const filters = data.map((supplier) => ({
        commandGroup: {
            props: {},

            nom: {
                commandItem: {
                    key: supplier.nom_societe,
                    name: ` ${supplier.nom_societe}`,
                    value: supplier.nom_societe,
                },
            },
        },
    }));

    const handleFilterChange = (filterValue: string) => {
        setFilterValue(filterValue); // Track the filter value

        // If "All" is selected, reset to the full data
        if (filterValue === "") {
            setFilteredData(data);
        } else {
            // Filter data based on the filter value
            const filtered = data.filter((supplier) =>
                Object.values(supplier).some((val) =>
                    String(val).toLowerCase().includes(filterValue.toLowerCase())
                )
            );
            setFilteredData(filtered);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Token is missing");
            }

            const response = await fetch(
                `http://localhost:3000/api/suppliers/${supplierToDelete.fournisseur_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete supplier");
            }
            setLoading(true); // Start loading

            // Remove the deleted client from the table by updating state
            setTimeout(() => {
                // Remove the deleted supplier from the table by updating state
                const updatedData = data.filter(
                    (item) => item.fournisseur_id !== supplierToDelete.fournisseur_id
                );
                setData(updatedData);
                setFilteredData(updatedData);
                setDeleteDialogOpen(false); // Close the dialog after deletion
                setLoading(false); // End loading

                toast({
                    title: "Fournisseur Supprimé",
                    description: "Le fournisseur a été supprimé avec succès.",
                    className: "bg-green-600 text-white",
                });
            }, 2000); // 2-second delay
        } catch (error) {
            console.error("Error deleting supplier:", error);
            toast({
                title: "Erreur",
                description: "Erreur lors de la suppresssion du fournisseur.",
                className: "bg-red-600 text-white",
            });
        }
    };

    const openDeleteDialog = (supplier) => {
        setSupplierToDelete(supplier);
        setDeleteDialogOpen(true); // Open the delete confirmation dialog
    };

    const handleAddSupplier = (newSupplier) => {
        // Apply the `getReglementBadge` to the new client's `reglement` field
        const formattedSupplier = {
            ...newSupplier,
            reglement: getReglementBadge(newSupplier.reglement),
        };

        // Update the state with the formatted client data
        setData((prevData) => [...prevData, formattedSupplier]);
        setFilteredData((prevData) => [...prevData, formattedSupplier]);
        setIsSheetOpen(false); // Close the sheet after adding
    };

    // Handle modification of an existing client
    const handleModifySupplier = (updatedSupplier) => {
        // Apply the `getReglementBadge` to the updated client's `reglement` field
        const formattedSupplier = {
            ...updatedSupplier,
            reglement: getReglementBadge(updatedSupplier.reglement), // Format the reglement
        };

        // Update the state with the formatted client data
        setData((prevData) =>
            prevData.map((supplier) =>
                supplier.fournisseur_id === formattedSupplier.fournisseur_id
                    ? formattedSupplier
                    : supplier
            )
        );
        setFilteredData((prevData) =>
            prevData.map((supplier) =>
                supplier.fournisseur_id === formattedSupplier.fournisseur_id
                    ? formattedSupplier
                    : supplier
            )
        );
        setIsSheetOpen(false); // Close the sheet after modifying
    };

    const handleAddNew = () => {
        setFormType("add");
        setIsSheetOpen(true);
    };

    const handleEdit = (row) => {
        setSelectedSupplier(row.fournisseur_id);
        setFormType("edit");
        setIsSheetOpen(true);
    };

    return (
        <div className="w-full">
            <DeployableTable
                data={filteredData} // Use filtered data for the table
                columnsConfig={columnsConfig}
                filters={filters} // Pass filters prop
                viewOptions={[]}
                onFilterChange={handleFilterChange} // Pass filter change handler
                onViewChange={() => {}}
                onAddNew={handleAddNew}
                onEdit={handleEdit}
                onDelete={openDeleteDialog} // Open delete dialog instead of deleting directly
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                limitPerPage={limitPerPage}
                showActions={true}
                tableHeight="h-full lg:h-[70vh]"
                tableWidth="auto"
                containerHeight="h-full lg:h-[85vh]"
                tableTitle="FOURNISSEURS"
                tooltipContent="Ajouter un fournisseur"
                loading={loading}
            />
            <CustomSheet
                showTrigger={false}
                title={
                    formType === "add" ? "Créer un nouveau fournisseur" : "Modifier le fournisseur"
                }
                description={
                    formType === "add"
                        ? "Veuillez remplir les informations nécessaires pour créer un nouveau fournisseur."
                        : "Modifiez les informations du fournisseur sélectionné."
                }
                onSaveChanges={() => setIsSheetOpen(false)}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                size="w-[90%] lg:w-[50%] h-full overflow-auto"
                backgroundColor="bg-gray-900"
                titleColor="text-white"
            >
                {formType === "add" ? (
                    <CreateSupplierForm onAddSupplier={handleAddSupplier} />
                ) : (
                    selectedSupplier && (
                        <ModifySuppliertForm
                            onModifySupplier={handleModifySupplier}
                            fournisseurID={selectedSupplier}
                        />
                    )
                )}
            </CustomSheet>

            {/* Delete Confirmation Dialog */}
            <CustomAlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Vous êtes sur le point d'effacer un Fournisseur"
                description="Si vous continuez, cela entraînera la suppression définitive de tout ce qui est lié à ce fournisseur."
                cancelText="Annuler"
                actionText="Procéder"
                onActionClick={handleDelete}
                onCancelClick={() => setDeleteDialogOpen(false)}
                contentBgColor="bg-gray-50"
                actionButtonVariant="destructive"
                cancelButtonVariant="default"
            >
                {/* You can customize this button as the trigger */}
                <button className="hidden" />
            </CustomAlertDialog>
        </div>
    );
};

export default FournisseursLandingPage;
