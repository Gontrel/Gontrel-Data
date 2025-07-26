import { useState } from "react";
import { ActiveRestaurantType } from "@/types/restaurant";

export const useActiveRestaurants = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [restaurants, setRestaurantsData] = useState<ActiveRestaurantType[]>(
    []
  );

  const handleRowSelect = (selectedRows: ActiveRestaurantType[]) => {
    console.log("Selected rows:", selectedRows);
  };

  const handleSave = (id: string, field: string, value: unknown) => {
    // Implement save logic here
    console.log(`Saving restaurant ${id}: ${field} = ${value}`);
  };

  return {
    expandedRows,
    setExpandedRows,
    restaurants,
    setRestaurantsData,
    handleRowSelect,
    handleSave,
  };
};
