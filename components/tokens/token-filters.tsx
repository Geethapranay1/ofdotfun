"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface TokenFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function TokenFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: TokenFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative flex-1 w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search tokens..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2 items-center w-full sm:w-auto">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="marketcap-high">Market Cap (High)</SelectItem>
            <SelectItem value="marketcap-low">Market Cap (Low)</SelectItem>
            <SelectItem value="volume-high">Volume (High)</SelectItem>
            <SelectItem value="volume-low">Volume (Low)</SelectItem>
            <SelectItem value="progress-high">Progress (High)</SelectItem>
            <SelectItem value="progress-low">Progress (Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
