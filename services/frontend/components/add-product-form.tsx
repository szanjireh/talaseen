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

interface AddProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddProductForm({ onSuccess, onCancel }: AddProductFormProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    type: 'RING',
    weight: '',
    size: '',
    makingFee: '',
    profitPercent: '',
    goldPriceAtCreation: '',
  });
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  // Auto-calculate final price
  useEffect(() => {
    const weight = parseFloat(formData.weight) || 0;
    const goldPrice = parseFloat(formData.goldPriceAtCreation) || 0;
    const makingFee = parseFloat(formData.makingFee) || 0;
    const profitPercent = parseFloat(formData.profitPercent) || 0;

    if (weight > 0 && goldPrice > 0) {
      const goldCost = weight * goldPrice;
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type || !formData.weight || !formData.goldPriceAtCreation) {
      alert('Please fill in all required fields');
      return;
    }

    if (imageFiles.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    try {
      setLoading(true);

      // First, upload images (in a real app, you'd use a service like Cloudinary or S3)
      // For MVP, we'll use placeholder URLs
      const imageUrls = imageFiles.map((_, index) => ({
        url: `https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop&q=${index}`,
        isPrimary: index === 0,
      }));

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
        images: imageUrls,
      };

      const response = await fetch(api.products.create(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Product created successfully!');
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Images */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Product Images (Max 5) *
            </label>
            <div className="grid grid-cols-5 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-orange-600 text-white text-xs px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
              {imageFiles.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-600 hover:bg-orange-50 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">First image will be the primary image</p>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Product Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Elegant Gold Ring"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your product..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Product Type *</label>
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
              <label className="text-sm font-medium mb-2 block">Size (optional)</label>
              <Input
                type="number"
                step="0.1"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                placeholder="e.g., 7 (for ring size)"
              />
            </div>
          </div>

          {/* Pricing Calculations */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Price Calculation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    Weight (grams) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="e.g., 10.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Gold Price ($/gram) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.goldPriceAtCreation}
                    onChange={(e) => handleInputChange('goldPriceAtCreation', e.target.value)}
                    placeholder="e.g., 65.50"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Making Fee ($) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.makingFee}
                    onChange={(e) => handleInputChange('makingFee', e.target.value)}
                    placeholder="e.g., 100"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Profit Percent (%) *
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.profitPercent}
                    onChange={(e) => handleInputChange('profitPercent', e.target.value)}
                    placeholder="e.g., 15"
                    required
                  />
                </div>
              </div>

              {/* Calculation Breakdown */}
              {calculatedPrice > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-blue-300">
                  <h4 className="font-semibold mb-2">Price Breakdown:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Gold Cost ({formData.weight}g × ${formData.goldPriceAtCreation}):</span>
                      <span className="font-medium">
                        ${((parseFloat(formData.weight) || 0) * (parseFloat(formData.goldPriceAtCreation) || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Making Fee:</span>
                      <span className="font-medium">${parseFloat(formData.makingFee || '0').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">
                        ${(((parseFloat(formData.weight) || 0) * (parseFloat(formData.goldPriceAtCreation) || 0)) + (parseFloat(formData.makingFee) || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit ({formData.profitPercent}%):</span>
                      <span className="font-medium text-green-600">
                        +${((calculatedPrice - (((parseFloat(formData.weight) || 0) * (parseFloat(formData.goldPriceAtCreation) || 0)) + (parseFloat(formData.makingFee) || 0)))).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-blue-300 mt-2">
                      <span className="font-bold text-lg">Final Price:</span>
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
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
