'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, SlidersHorizontal, DollarSign, Weight, TrendingUp, Wrench } from 'lucide-react';
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
      {/* Mobile Toggle - Premium */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full mb-4 lg:hidden flex items-center justify-between border-2 border-amber-300 hover:bg-amber-50 h-12 rounded-xl font-semibold"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-amber-600" />
          فیلترهای جستجو
        </span>
        {hasActiveFilters && (
          <span className="bg-gold-gradient text-gray-900 text-xs px-3 py-1 rounded-full font-bold">
            فعال
          </span>
        )}
      </Button>

      {/* Filters Panel - Premium Design */}
      <div className={`${isOpen ? 'block' : 'hidden lg:block'}`}>
        <Card className="p-6 space-y-6 border-2 border-amber-100 shadow-lg bg-gradient-to-br from-white to-amber-50/30">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-amber-200">
            <h3 className="font-bold text-xl flex items-center gap-2 text-gray-900">
              <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center">
                <SlidersHorizontal className="h-5 w-5 text-gray-900" />
              </div>
              فیلترهای پیشرفته
            </h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-100 font-semibold"
              >
                <X className="h-4 w-4 ml-1" />
                پاک کردن
              </Button>
            )}
          </div>

          {/* Price Range - Premium */}
          <div className="bg-white rounded-xl p-4 border-2 border-amber-100">
            <label className="font-bold text-base mb-3 flex items-center gap-2 text-gray-900">
              <DollarSign className="w-5 h-5 text-amber-600" />
              محدوده قیمت
            </label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="حداقل"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="text-sm text-right border-2 border-amber-200 focus:border-amber-500 rounded-xl"
              />
              <span className="text-amber-600 font-bold">—</span>
              <Input
                type="number"
                placeholder="حداکثر"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="text-sm text-right border-2 border-amber-200 focus:border-amber-500 rounded-xl"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">قیمت به تومان</p>
          </div>

          {/* Weight Range - Premium */}
          <div className="bg-white rounded-xl p-4 border-2 border-amber-100">
            <label className="font-bold text-base mb-3 flex items-center gap-2 text-gray-900">
              <Weight className="w-5 h-5 text-amber-600" />
              محدوده وزن
            </label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="حداقل"
                value={localFilters.minWeight || ''}
                onChange={(e) => handleFilterChange('minWeight', e.target.value)}
                className="text-sm text-right border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                step="0.1"
              />
              <span className="text-amber-600 font-bold">—</span>
              <Input
                type="number"
                placeholder="حداکثر"
                value={localFilters.maxWeight || ''}
                onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
                className="text-sm text-right border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                step="0.1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">وزن به گرم</p>
          </div>

          {/* Max Profit Percent - Premium */}
          <div className="bg-white rounded-xl p-4 border-2 border-amber-100">
            <label className="font-bold text-base mb-3 flex items-center gap-2 text-gray-900">
              <TrendingUp className="w-5 h-5 text-green-600" />
              حداکثر درصد سود
            </label>
            <Input
              type="number"
              placeholder="مثال: ۲۰"
              value={localFilters.maxProfitPercent || ''}
              onChange={(e) => handleFilterChange('maxProfitPercent', e.target.value)}
              className="text-sm text-right border-2 border-amber-200 focus:border-amber-500 rounded-xl"
              step="0.5"
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              نمایش محصولات با سود کمتر از این مقدار
            </p>
          </div>

          {/* Max Making Fee - Premium */}
          <div className="bg-white rounded-xl p-4 border-2 border-amber-100">
            <label className="font-bold text-base mb-3 flex items-center gap-2 text-gray-900">
              <Wrench className="w-5 h-5 text-amber-600" />
              حداکثر اجرت ساخت
            </label>
            <Input
              type="number"
              placeholder="مثال: ۱۰۰"
              value={localFilters.maxMakingFee || ''}
              onChange={(e) => handleFilterChange('maxMakingFee', e.target.value)}
              className="text-sm text-right border-2 border-amber-200 focus:border-amber-500 rounded-xl"
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              نمایش محصولات با اجرت کمتر از این مقدار
            </p>
          </div>

          {/* Apply Button - Premium */}
          <Button
            onClick={applyFilters}
            className="w-full bg-gold-gradient hover:opacity-90 text-gray-900 font-bold h-12 text-base shadow-lg rounded-xl transition-opacity"
          >
            اعمال فیلترها
          </Button>
        </Card>
      </div>
    </div>
  );
}
