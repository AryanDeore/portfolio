"use client";

import * as React from "react";
import { Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
  placeholder?: string;
  showSearch?: boolean;
  maxVisibleTags?: number;
}

export function TagFilter({
  availableTags,
  selectedTags,
  onTagsChange,
  className,
  placeholder = "Search tags...",
  showSearch = true,
  maxVisibleTags = 12,
}: TagFilterProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Filter tags based on search query
  const filteredTags = React.useMemo(() => {
    if (!searchQuery) return availableTags;
    return availableTags.filter(tag =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableTags, searchQuery]);

  // Show limited tags initially, expand on demand
  const visibleTags = isExpanded ? filteredTags : filteredTags.slice(0, maxVisibleTags);
  const hasMoreTags = filteredTags.length > maxVisibleTags;

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newSelectedTags);
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with search and clear */}
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-10 py-2 text-sm",
                "bg-muted/50 border border-border/50 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40",
                "transition-all duration-200",
                "placeholder:text-muted-foreground"
              )}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Clear all button */}
        {selectedTags.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            Clear all
          </Button>
        )}

        {/* Selected count */}
        {selectedTags.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {selectedTags.length} selected
          </div>
        )}
      </div>

      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Filter className="w-3 h-3" />
            Active filters
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 transition-all duration-200",
                  "group"
                )}
              >
                {tag}
                <X className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Available tags */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-muted-foreground">
          Available tags ({filteredTags.length})
        </div>
        
        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200",
                  "border border-border/50",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary/50 shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border",
                  "hover:scale-105 active:scale-95"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Expand/collapse button */}
        {hasMoreTags && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {isExpanded 
              ? `Show less (${filteredTags.length - maxVisibleTags} hidden)`
              : `Show ${filteredTags.length - maxVisibleTags} more tags`
            }
          </button>
        )}
      </div>

      {/* No results message */}
      {searchQuery && filteredTags.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-sm">No tags found for "{searchQuery}"</div>
          <button
            onClick={handleClearSearch}
            className="text-xs text-primary hover:text-primary/80 transition-colors mt-1"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

// Compact version for smaller spaces
interface CompactTagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

export function CompactTagFilter({
  availableTags,
  selectedTags,
  onTagsChange,
  className,
}: CompactTagFilterProps) {
  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newSelectedTags);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200",
              "border border-border/50",
              isSelected
                ? "bg-primary text-primary-foreground border-primary/50"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border",
              "hover:scale-105 active:scale-95"
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
