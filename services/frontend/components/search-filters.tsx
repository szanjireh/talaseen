'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export interface FilterState {
  minPrice?: string;
  maxPrice?: string;
  minWeight?: string;
  maxWeight?: string;
  maxProfitPercent?: string;
  maxMakingFee?: string;
}

export function SearchFilters({ onFilterChange, activeFilters }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [localFilters, setLocalFilters] = useState<FilterState>(activeFilters || {});

  useEffect(() => {
    setLocalFilters(activeFilters || {});
  }, [activeFilters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(localFilters || {}).some((v) => v && v !== '');

  return (
    <div className="w-full">
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full mb-4 lg:hidden flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          فیلترها
        </span>
        {hasActiveFilters && (
          <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">
            فعال
          </span>
        )}
      </Button>

      {/* Filters Panel */}
      <div className={`${isOpen ? 'block' : 'hidden lg:block'}`}>
        <Card className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              فیلترها
            </h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-orange-600"
              >
                پاک کردن همه
              </Button>
            )}
          </div>

          {/* Price Range */}
          <div>
            <label className="font-medium text-sm mb-3 block text-right">محدوده قیمت (تومان)</label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="حداقل"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="text-sm text-right"
              />
              <span className="text-gray-400">—</span>
              <Input
                type="number"
                placeholder="حداکثر"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="text-sm text-right"
              />
            </div>
          </div>

          {/* Weight Range */}
          <div>
            <label className="font-medium text-sm mb-3 block text-right">محدوده وزن (گرم)</label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="حداقل"
                value={localFilters.minWeight || ''}
                onChange={(e) => handleFilterChange('minWeight', e.target.value)}
                className="text-sm text-right"
                step="0.1"
              />
              <span className="text-gray-400">—</span>
              <Input
                type="number"
                placeholder="حداکثر"
                value={localFilters.maxWeight || ''}
                onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
                className="text-sm text-right"
                step="0.1"
              />
            </div>
          </div>

          {/* Max Profit Percent */}
          <div>
            <label className="font-medium text-sm mb-3 block text-right">حداکثر درصد سود (%)</label>
            <Input
              type="number"
              placeholder="مثال: ۲۰"
              value={localFilters.maxProfitPercent || ''}
              onChange={(e) => handleFilterChange('maxProfitPercent', e.target.value)}
              className="text-sm text-right"
              step="0.5"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">نمایش محصولات با سود کمتر از این مقدار</p>
          </div>

          {/* Max Making Fee */}
          <div>
            <label className="font-medium text-sm mb-3 block text-right">حداکثر اجرت ساخت (تومان)</label>
            <Input
              type="number"
              placeholder="مثال: ۱۰۰"
              value={localFilters.maxMakingFee || ''}
              onChange={(e) => handleFilterChange('maxMakingFee', e.target.value)}
              className="text-sm text-right"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">نمایش محصولات با اجرت کمتر از این مقدار</p>
          </div>

          {/* Apply Button */}
          <Button
            onClick={applyFilters}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            اعمال فیلترها
          </Button>
        </Card>
      </div>
    </div>
  );
}
