import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, Edit2, Trash2, Plus, Search } from "lucide-react";
import CustomAutoComplete from "./CustomAutoComplete"; // Import CustomAutoComplete
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import classNames from "classnames";

interface ColumnConfig {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
    width?: string;
}

interface DeployableTableProps {
    data: any[];
    columnsConfig: ColumnConfig[];
    filters: { key: string; label: string }[]; // Now used for autocomplete filtering
    viewOptions: { key: string; label: string; value: string }[];
    onFilterChange: (filter: string) => void;
    onViewChange: (view: string) => void;
    onAddNew: () => void;
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    limitPerPage?: number;
    showActions?: boolean;
    tableHeight?: string;
    tableWidth?: string;
    containerHeight?: string;
    containerWidth?: string;
    tableTitle?: string;
    tooltipContent?: string;
    loading?: boolean;
    tableCaption?: string;
}

const DeployableTable: React.FC<DeployableTableProps> = ({
    data,
    columnsConfig,
    filters, // Accept filters prop for autocomplete
    viewOptions,
    onFilterChange,
    onViewChange,
    onAddNew,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange,
    limitPerPage = 15,
    showActions = true,
    tableHeight = "24rem",
    tableWidth = "100%",
    containerWidth = "100%",
    containerHeight = "auto",
    tableTitle = "Table Title",
    tooltipContent = "Ajouter un élément",
    loading = false,
    tableCaption,
}) => {
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>(""); // Track the selected filter value
    const [searchTerm, setSearchTerm] = useState<string>(""); // For search functionality
    const [sortColumn, setSortColumn] = useState<string>(""); // For sorting functionality
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Track the sort direction

    // Sorting logic
    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnKey);
            setSortDirection("asc");
        }
    };

    // Memoized data filtering and sorting
    const filteredAndSortedData = useMemo(() => {
        let filteredData = data;

        // Filter based on CustomAutoComplete selection
        if (selectedFilter && selectedFilter !== "All") {
            filteredData = data.filter((item) =>
                Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(selectedFilter.toLowerCase())
                )
            );
        }

        // Filter by search term
        if (searchTerm) {
            filteredData = filteredData.filter((item) =>
                Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (sortColumn) {
            filteredData = filteredData.sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];

                if (typeof aValue === "string" && typeof bValue === "string") {
                    return sortDirection === "asc"
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                if (typeof aValue === "number" && typeof bValue === "number") {
                    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
                }

                return 0;
            });
        }

        return filteredData;
    }, [data, selectedFilter, searchTerm, sortColumn, sortDirection]);

    // Pagination logic
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * limitPerPage;
        return filteredAndSortedData.slice(startIndex, startIndex + limitPerPage);
    }, [filteredAndSortedData, currentPage, limitPerPage]);

    const handleFilterChange = (value: string) => {
        setSelectedFilter(value);
        onFilterChange(value);
    };

    return (
        <div
            className={`rounded-lg bg-neutral-400 p-4 shadow-lg ${containerHeight} ${containerWidth}`}
        >
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-neutral-50">
                    <h2 className="px-4 py-2 text-3xl font-bold">{tableTitle}</h2>
                </div>
                <div className="flex space-x-2">
                    {/* Custom AutoComplete for filtering */}
                    <CustomAutoComplete
                        items={filters}
                        onFilterChange={handleFilterChange} // Pass filter change handler
                        size="large" // Make the component and popover bigger
                        showViewMore={false} // Remove View More button
                    />
                    {/* Search Input */}
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-md bg-muted py-2 pl-10 pr-4 text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={onAddNew}
                                className="rounded-full bg-neutral-50 px-2 py-2 text-black"
                            >
                                <Plus className="bg-white" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>{tooltipContent}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Table Container */}
            <div
                className={`overflow-auto ${tableHeight} rounded-md border-2 border-neutral-600`}
                style={{ width: tableWidth }}
            >
                <Table className="bg-gray-50" style={{ tableLayout: "fixed", width: "100%" }}>
                    <TableCaption>{tableCaption}</TableCaption>
                    <TableHeader className="bg-gray-800 ">
                        <TableRow className="hover:bg-gray-800">
                            {columnsConfig.map((column) => (
                                <TableHead
                                    key={column.key}
                                    className="cursor-pointer "
                                    onClick={() => handleSort(column.key)}
                                    style={{ width: column.width }}
                                >
                                    {column.label}
                                    {sortColumn === column.key && (
                                        <span className="ml-2">
                                            {sortDirection === "asc" ? "▲" : "▼"}
                                        </span>
                                    )}
                                </TableHead>
                            ))}
                            {showActions && <TableHead className="w-[150px]">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: limitPerPage }).map((_, index) => (
                                  <TableRow key={index}>
                                      {columnsConfig.map((column, colIndex) => (
                                          <TableCell key={colIndex}>
                                              <Skeleton className="h-10 w-full" />
                                          </TableCell>
                                      ))}
                                      {showActions && (
                                          <TableCell>
                                              <Skeleton className="h-10 w-full" />
                                          </TableCell>
                                      )}
                                  </TableRow>
                              ))
                            : paginatedData.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                      {columnsConfig.map((column) => (
                                          <TableCell
                                              key={column.key}
                                              style={{ width: column.width }}
                                          >
                                              {column.render
                                                  ? column.render(row[column.key], row)
                                                  : row[column.key]}
                                          </TableCell>
                                      ))}
                                      {showActions && (
                                          <TableCell className="flex space-x-2">
                                              <button
                                                  onClick={() => onEdit(row)}
                                                  className="rounded bg-indigo-500 px-2 py-1 text-white"
                                              >
                                                  <Edit2 />
                                              </button>
                                              <button
                                                  onClick={() => onDelete(row)}
                                                  className="rounded bg-red-500 px-2 py-1 text-white"
                                              >
                                                  <Trash2 />
                                              </button>
                                          </TableCell>
                                      )}
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <div>
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className={classNames(
                            "rounded-full px-2 py-2 transition-transform duration-150 ease-in-out",
                            currentPage === 1
                                ? "cursor-not-allowed bg-gray-300"
                                : "bg-indigo-600 text-white hover:scale-105"
                        )}
                    >
                        <ArrowLeft />
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className={classNames(
                            "rounded-full px-2 py-2 transition-transform duration-150 ease-in-out",
                            currentPage === totalPages
                                ? "cursor-not-allowed bg-gray-300"
                                : "bg-indigo-600 text-white hover:scale-105"
                        )}
                    >
                        <ArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeployableTable;
