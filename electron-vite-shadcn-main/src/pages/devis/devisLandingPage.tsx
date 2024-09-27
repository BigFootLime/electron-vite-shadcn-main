import React, { useState, useEffect } from "react";
import DeployableTable from "../../components/DeployableTable";
import { Badge } from "@/components/ui/badge";
import CustomSheet from "../../components/CustomSheet";
import CreateDevisForm from "./create-devis";

const DevisLandingPage = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
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
                    statut: getStatusBadge(item.statut),
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

    const getStatusBadge = (status) => {
        switch (status) {
            case "En cours":
                return (
                    <Badge className="cursor-not-allowed bg-orange-600 px-4 py-1 hover:bg-orange-600">
                        En cours
                    </Badge>
                );
            case "Accepté":
                return (
                    <Badge className="cursor-not-allowed bg-green-600 px-4 py-1 hover:bg-green-600">
                        Accepté
                    </Badge>
                );
            case "Annulée":
                return (
                    <Badge className="cursor-not-allowed bg-red-600 px-4 py-1 hover:bg-red-600">
                        Annulée
                    </Badge>
                );
            default:
                return <Badge color="transparent">{status}</Badge>; // Default badge for any other status
        }
    };

    const filters = [{ key: "all", label: "All", options: ["All", "Active", "Inactive"] }];

    const viewOptions = [
        { key: "grid", label: "Grid View", value: "grid" },
        { key: "list", label: "List View", value: "list" },
    ];
    const columnsConfig = [
        { key: "devis_id", label: "N° Devis", width: "120px" },
        { key: "version", label: "Version", width: "80px" },
        { key: "client_nom", label: "Nom Client", width: "200px" },
        { key: "date_creation", label: "Date de Création", width: "150px" },
        { key: "statut", label: "Statut", width: "120px" },
        { key: "delai_livraison", label: "Delai de Livraion", width: "150px" },
        { key: "interlocuteur", label: "Interlocuteur(-trice)", width: "220px" },
        { key: "total_ht", label: "Total HTT", width: "120px" },
        { key: "total_ttc", label: "Total TTC", width: "120px" },
        {
            key: "conditions_speciales",
            label: "Conditions Speciales",
            width: "200px",
        },
        { key: "remarques", label: "Remarques", width: "300px" },
    ];

    const handleAddNew = () => {
        setIsSheetOpen(true);
    };

    return (
        <div className="w-full">
            <DeployableTable
                data={data}
                columnsConfig={columnsConfig}
                filters={filters}
                viewOptions={viewOptions}
                onFilterChange={(filter) => console.log("Filter changed to:", filter)}
                onViewChange={(view) => console.log("View changed to:", view)}
                onAddNew={handleAddNew}
                onEdit={(row) => console.log("Edit row:", row)}
                onDelete={(row) => console.log("Delete row:", row)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                limitPerPage={limitPerPage}
                showActions={true}
                tableHeight={`h-full lg:h-[70vh] `} // Adjusted height calculation
                containerHeight={`h-full lg:h-[85vh] `} // Adjusted height calculation
                tableTitle="DEVIS CLIENTS"
                tooltipContent="Ajouter un devis"
            />
            <CustomSheet
                showTrigger={false}
                title="Créer un nouveau devis"
                description="Veuillez remplir les informations nécessaires pour créer un nouveau devis."
                onSaveChanges={() => setIsSheetOpen(false)} // Example of closing the sheet after saving
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                size="w-[90%] lg:w-[50%] h-full overflow-auto"
                backgroundColor="bg-gray-900"
                titleColor="text-white"
            >
                <CreateDevisForm />
            </CustomSheet>
        </div>
    );
};

export default DevisLandingPage;
