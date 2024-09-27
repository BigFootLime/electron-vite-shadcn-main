import React, { useState, useEffect } from "react";
import DeployableTable from "../../components/DeployableTable";
import { Badge } from "@/components/ui/badge";
import CustomSheet from "../../components/CustomSheet";
import { BanknoteIcon, CreditCardIcon } from "lucide-react";
import CreateClientForm from "./create-client";
import ModifyClientForm from "./modify-client";
import CustomAlertDialog from "../../components/CustomAlertDialog"; // Import the custom alert dialog component
import { toast } from "@/hooks/use-toast";

const ClientsLandingPage = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [formType, setFormType] = useState("add");
    const [selectedClient, setSelectedClient] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Store filtered data
    const [currentPage, setCurrentPage] = useState(1);
    const limitPerPage = 25;
    const totalPages = Math.ceil(filteredData.length / limitPerPage); // Update to use filteredData
    const [loading, setLoading] = useState(true);
    const [selectedFilterColumn, setSelectedFilterColumn] = useState(""); // Track selected column for filtering
    const [filterValue, setFilterValue] = useState(""); // Track filter value

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete dialog
    const [clientToDelete, setClientToDelete] = useState(null); // Track which client is being deleted

    useEffect(() => {
        const fetchClientData = async () => {
            setLoading(true); // Start loading
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Token is missing");
                }

                const response = await fetch(`http://localhost:3000/api/clients`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch client data");
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
            case "CH45J":
                return (
                    <Badge className="bg-green-500 px-4 py-1 hover:bg-green-500">
                        <div className="flex flex-row text-white">
                            CH45J <BanknoteIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            case "VIR60":
                return (
                    <Badge className="bg-emerald-500 px-4 py-1 hover:bg-emerald-500">
                        <div className="flex flex-row text-white">
                            VIR60 <CreditCardIcon className="ml-2 h-5 w-5 text-white" />
                        </div>
                    </Badge>
                );
            default:
                return <Badge color="transparent">{reglement}</Badge>;
        }
    };

    const columnsConfig = [
        { key: "client_id", label: "N° Client", width: "120px" },
        { key: "nom", label: "Nom Client", width: "200px" },
        { key: "rue", label: "Rue", width: "300px" },
        { key: "localite", label: "Ville", width: "250px" },
        { key: "code_postal", label: "Code Postal", width: "100px" },
        { key: "pays", label: "Pays", width: "120px" },
        { key: "siret", label: "SIRET", width: "200px" },
        { key: "telephone", label: "Téléphone", width: "180px" },
        { key: "telecopie", label: "Télécopie", width: "180px" },
        { key: "compte_tiers", label: "Compte Tiers", width: "190px" },
        { key: "reglement", label: "Règlement", width: "150px" },
        { key: "groupe_financier", label: "Groupe Financier", width: "180px" },
        { key: "contact_principal", label: "Contact Principal", width: "180px" },
    ];

    // Define filters for ID, Name, Phone Number
    const filters = data.map((client) => ({
        commandGroup: {
            props: {},

            nom: {
                commandItem: {
                    key: client.nom,
                    name: ` ${client.nom}`,
                    value: client.nom,
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
            const filtered = data.filter((client) =>
                Object.values(client).some((val) =>
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
                `http://localhost:3000/api/clients/${clientToDelete.client_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete client");
            }

            // Remove the deleted client from the table by updating state
            const updatedData = data.filter((item) => item.client_id !== clientToDelete.client_id);
            setData(updatedData);
            setFilteredData(updatedData);
            setDeleteDialogOpen(false); // Close the dialog after deletion
            toast({
                title: "Client Supprimé",
                description: "Le client a été supprimé avec succès.",
                className: "bg-green-600 text-white",
            });
        } catch (error) {
            console.error("Error deleting client:", error);
            toast({
                title: "Erreur",
                description: "Erreur lors de la suppresssion du client.",
                className: "bg-red-600 text-white",
            });
        }
    };

    const openDeleteDialog = (client) => {
        setClientToDelete(client);
        setDeleteDialogOpen(true); // Open the delete confirmation dialog
    };

    const handleAddClient = (newClient) => {
        // Apply the `getReglementBadge` to the new client's `reglement` field
        const formattedClient = {
            ...newClient,
            reglement: getReglementBadge(newClient.reglement),
        };

        // Update the state with the formatted client data
        setData((prevData) => [...prevData, formattedClient]);
        setFilteredData((prevData) => [...prevData, formattedClient]);
        setIsSheetOpen(false); // Close the sheet after adding
    };

    // Handle modification of an existing client
    const handleModifyClient = (updatedClient) => {
        // Apply the `getReglementBadge` to the updated client's `reglement` field
        const formattedClient = {
            ...updatedClient,
            reglement: getReglementBadge(updatedClient.reglement), // Format the reglement
        };

        // Update the state with the formatted client data
        setData((prevData) =>
            prevData.map((client) =>
                client.client_id === formattedClient.client_id ? formattedClient : client
            )
        );
        setFilteredData((prevData) =>
            prevData.map((client) =>
                client.client_id === formattedClient.client_id ? formattedClient : client
            )
        );
        setIsSheetOpen(false); // Close the sheet after modifying
    };

    const handleAddNew = () => {
        setFormType("add");
        setIsSheetOpen(true);
    };

    const handleEdit = (row) => {
        setSelectedClient(row.client_id);
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
                tableTitle="CLIENTS"
                tooltipContent="Ajouter un client"
                loading={loading}
            />
            <CustomSheet
                showTrigger={false}
                title={formType === "add" ? "Créer un nouveau client" : "Modifier le client"}
                description={
                    formType === "add"
                        ? "Veuillez remplir les informations nécessaires pour créer un nouveau client."
                        : "Modifiez les informations du client sélectionné."
                }
                onSaveChanges={() => setIsSheetOpen(false)}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                size="w-[90%] lg:w-[50%] h-full overflow-auto"
                backgroundColor="bg-gray-900"
                titleColor="text-white"
            >
                {formType === "add" ? (
                    <CreateClientForm onAddClient={handleAddClient} />
                ) : (
                    selectedClient && (
                        <ModifyClientForm
                            onModifyClient={handleModifyClient}
                            clientId={selectedClient}
                        />
                    )
                )}
            </CustomSheet>

            {/* Delete Confirmation Dialog */}
            <CustomAlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Vous êtes sur le point d'effacer un Client"
                description="Si vous continuez, cela entraînera la suppression définitive de tout ce qui est lié à ce client."
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

export default ClientsLandingPage;
