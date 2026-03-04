import React, { FC, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCreateProduct } from '@/presentation/features/product/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Loader2, Package, DollarSign, Image, Tag, FileText } from 'lucide-react';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

// Label component
const Label: FC<{ children: React.ReactNode; htmlFor?: string; className?: string }> = ({ children, htmlFor, className }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}>
    {children}
  </label>
);

// Textarea component
const Textarea: FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    {...props}
  />
);

// Select component using native HTML select
const Select: FC<{ children: React.ReactNode; value?: string; onValueChange?: (value: string) => void }> = ({ children, value, onValueChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </select>
  );
};

const SelectItem: FC<{ children: React.ReactNode; value: string }> = ({ children, value }) => (
  <option value={value}>{children}</option>
);

const AddProductPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: createProduct, isPending: isLoading } = useCreateProduct();
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    image: '',
  });

  const categories = [
    'Electronics',
    'Jewelery',
    "Men's Clothing",
    "Women's Clothing",
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error(t('productTitleRequired') || 'Product title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error(t('productDescriptionRequired') || 'Product description is required');
      return;
    }
    if (formData.price <= 0) {
      toast.error(t('priceMustBeGreaterThanZero') || 'Price must be greater than 0');
      return;
    }
    if (!formData.category) {
      toast.error(t('pleaseSelectCategory') || 'Please select a category');
      return;
    }
    if (!formData.image.trim()) {
      toast.error(t('productImageRequired') || 'Product image URL is required');
      return;
    }

    createProduct(formData, {
      onSuccess: () => {
        navigate('/admin');
      }
    });
  };

  const handleCancel = () => {
    if (window.confirm(t('confirmCancel') || 'Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/admin');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t('addNewProduct') || 'Add New Product'}</h1>
            <p className="text-muted-foreground">{t('fillProductDetails') || 'Fill in the product details below'}</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('productInformation') || 'Product Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {t('productTitle') || 'Product Title'}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t('enterProductTitle') || 'Enter product title'}
                  required
                  className="h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {t('description') || 'Description'}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t('enterProductDescription') || 'Enter product description'}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {t('provideDetailedDescription') || 'Provide a detailed description of the product'}
                </p>
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {t('price') || 'Price ($)'}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                      className="h-11 pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {t('category') || 'Category'}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <option value="">{t('selectCategory')}</option>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image" className="flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  {t('imageUrl') || 'Image URL'}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="h-11"
                />
                <p className="text-sm text-muted-foreground">
                  {t('enterValidImageUrl') || 'Enter a valid image URL'}
                </p>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    {t('imagePreview') || 'Image Preview'}
                  </Label>
                  <div className="border rounded-lg p-4 bg-muted/50 text-center">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="max-h-[200px] max-w-full object-contain mx-auto rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/200?text=Invalid+URL';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('addingProduct') || 'Adding Product...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {t('addProduct') || 'Add Product'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 sm:flex-initial"
                >
                  {t('cancel') || 'Cancel'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProductPage;
