"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { sorts } from "@/constants";

interface SortButtonProps {
  currentSort: string;
}

const SortButton = ({ currentSort }: SortButtonProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    router.push(`/admin/Books?${params.toString()}`);
  };

  const currentSortLabel =
    sorts.find((s) => s.value === currentSort)?.label || "A-Z";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-light-400 text-dark-200 hover:bg-light-300"
        >
          <ArrowUpDown size={16} />
          <span className="max-sm:hidden">{currentSortLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sorts.map((sort) => (
          <DropdownMenuItem
            key={sort.value}
            onClick={() => handleSort(sort.value)}
            className={currentSort === sort.value ? "bg-light-300" : ""}
          >
            {sort.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortButton;
