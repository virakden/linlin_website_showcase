import { useState, useEffect } from "react";

// Safe getter — works on browser only (no SSR issue)
function getItemsPerPage(): number {
  if (typeof window === "undefined") return 8;
  return window.innerWidth >= 768 ? 8 : 6;
}

function useItemsPerPage(): number {
  const [items, setItems] = useState(getItemsPerPage); // ✅ pass fn reference

  useEffect(() => {
    const handler = () => setItems(getItemsPerPage());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return items;
}

export function usePagination<T>(data: T[], resetKey?: unknown) {
  const itemsPerPage = useItemsPerPage();
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when category/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [resetKey]);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  // Clamp page if resize shrinks totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(start, start + itemsPerPage);

  return {
    paginatedData,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
  };
}
