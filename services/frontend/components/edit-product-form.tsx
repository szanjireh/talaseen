'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { X, Upload, DollarSign, Percent, Weight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';

interface ProductFormData {
  title: string;
  description: string;
  type: string;
  weight: string;
  size: string;
  makingFee: string;
  profitPercent: string;
  goldPriceAtCreation: string;
}

const PRODUCT_TYPES = [
  'RING',
  'BRACELET',
  'NECKLACE',
  'EARRING',
  'BANGLE',
  'PENDANT',
  'ANKLET',
  'CHAIN',
  'COIN',
  'BAR',
  'OTHER',
];

interface EditProductFormProps {
  product: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditProductForm({ product, onSuccess, onCancel }: EditProductFormProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    title: product.title || '',
    description: product.description || '',
    type: product.type || 'RING',
    weight: product.weight?.toString() || '',
    size: product.size?.toString() || '',
    makingFee: product.makingFee?.toString() || '',
    profitPercent: product.profitPercent?.toString() || '',
    goldPriceAtCreation: product.goldPriceAtCreation?.toString() || '',
  });
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  // Auto-calculate final price
  useEffect(() => {
    const weight = parseFloat(formData.weight) || 0;
    const goldPrice = parseFloat(formData.goldPriceAtCreation) || 0;
    const makingFeePercent = parseFloat(formData.makingFee) || 0;
    const profitPercent = parseFloat(formData.profitPercent) || 0;

    if (weight > 0 && goldPrice > 0) {
      const goldCost = weight * goldPrice;
      const makingFee = goldCost * (makingFeePercent / 100);
      const costWithFee = goldCost + makingFee;
      const finalPrice = costWithFee * (1 + profitPercent / 100);
      setCalculatedPrice(finalPrice);
    } else {
      setCalculatedPrice(0);
    }
  }, [formData.weight, formData.goldPriceAtCreation, formData.makingFee, formData.profitPercent]);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type || !formData.weight || !formData.goldPriceAtCreation) {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    try {
      setLoading(true);

      const productData = {
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        weight: parseFloat(formData.weight),
        size: formData.size ? parseFloat(formData.size) : null,
        makingFee: parseFloat(formData.makingFee),
        profitPercent: parseFloat(formData.profitPercent),
        goldPriceAtCreation: parseFloat(formData.goldPriceAtCreation),
        finalPrice: calculatedPrice,
      };

      const response = await fetch(api.products.update(product.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('محصول با موفقیت به‌روزرسانی شد!');
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || 'به‌روزرسانی محصول ناموفق بود');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('به‌روزرسانی محصول ناموفق بود. لطفاً دوباره امتحان کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ویرایش محصول</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">عنوان محصول *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="مثلاً: انگشتر طلای ظریف"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">توضیحات</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="محصول خود را توضیح دهید..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">نوع محصول *</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">سایز (اختیاری)</label>
              <Input
                type="number"
                step="0.1"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                placeholder="مثلاً: 7 (برای سایز انگشتر)"
              />
            </div>
          </div>

          {/* Pricing Calculations */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">محاسبه قیمت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    وزن (گرم) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="مثلاً: 10.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    قیمت طلا ($/گرم) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.goldPriceAtCreation}
                    onChange={(e) => handleInputChange('goldPriceAtCreation', e.target.value)}
                    placeholder="مثلاً: 65.50"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    درصد اجرت ساخت (%) *
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.makingFee}
                    onChange={(e) => handleInputChange('makingFee', e.target.value)}
                    placeholder="مثلاً: 15"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    درصد سود (%) *
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.profitPercent}
                    onChange={(e) => handleInputChange('profitPercent', e.target.value)}
                    placeholder="مثلاً: 15"
                    required
                  />
                </div>
              </div>

              {/* Calculation Breakdown */}
              {calculatedPrice > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-blue-300">
                  <h4 className="font-semibold mb-2">جزئیات قیمت:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>هزینه طلا ({formData.weight}گرم × ${formData.goldPriceAtCreation}):</span>
                      <span className="font-medium">
                        ${((parseFloat(formData.weight) || 0) * (parseFloat(formData.goldPriceAtCreation) || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>اجرت ساخت ({formData.makingFee}%):</span>
                      <span className="font-medium">
                        ${(((parseFloat(formData.weight) || 0) * (parseFloat(formData.goldPriceAtCreation) || 0)) * ((parseFloat(formData.makingFee) || 0) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>جمع جزء:</span>
                      <span className="font-medium">
                        ${(((parseFloat(formData.weight) || 0) * (parseFloat(formData.goldPriceAtCreation) || 0)) * (1 + (parseFloat(formData.makingFee) || 0) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>سود ({formData.profitPercent}%):</span>
                      <span className="font-medium text-green-600">
                        +${((calculatedPrice - (((parseFloat(formData.weight) || 0) * (parseFloat(formData.goldPriceAtCreation) || 0)) * (1 + (parseFloat(formData.makingFee) || 0) / 100)))).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-blue-300 mt-2">
                      <span className="font-bold text-lg">قیمت نهایی:</span>
                      <span className="font-bold text-lg text-orange-600">
                        ${calculatedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || calculatedPrice === 0}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {loading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی محصول'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              لغو
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
