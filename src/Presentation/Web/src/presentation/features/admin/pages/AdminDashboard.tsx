import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProducts, useDeleteProduct } from '@/presentation/features/product/hooks/useProducts';
import Loader from '@/presentation/shared/components/Loader';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Plus,
  Receipt,
  UserCog,
  Clock,
  Settings,
  Pencil,
  Trash2,
  CheckCircle,
  Info,
  Box,
  UserPlus,
  LayoutDashboard,
  Star
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

// Types
interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
}

interface Product {
  id: number;
  title: string;
  image: string;
  category: string;
  price: number;
  rating: { rate: number };
}

// StatsCards Component
const StatsCards: FC<{ stats: Stats }> = ({ stats }) => {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('totalProducts'),
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: t('totalOrders'),
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: t('totalRevenue'),
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      title: t('activeUsers'),
      value: stats.activeUsers,
      icon: Users,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card key={card.title} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold">{card.value}</h3>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Activity Item Component
interface ActivityItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  color: string;
  bgColor: string;
}

const ActivityItem: FC<ActivityItemProps> = ({ icon: Icon, title, description, time, color, bgColor }) => (
  <div className="flex items-center py-3 border-b border-border last:border-0">
    <div className={`${bgColor} p-2 rounded-lg mr-3`}>
      <Icon className={`h-4 w-4 ${color}`} />
    </div>
    <div className="flex-grow">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <span className="text-xs text-muted-foreground">{time}</span>
  </div>
);

// OverviewTab Component
interface OverviewTabProps {
  onAddProduct: () => void;
  onViewAuditLogs: () => void;
}

const OverviewTab: FC<OverviewTabProps> = ({ onAddProduct, onViewAuditLogs }) => {
  const { t } = useTranslation();

  const activities = [
    {
      icon: CheckCircle,
      title: 'New order received',
      description: 'Order #1234 - $299.99',
      time: '2 min ago',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: Box,
      title: 'Product added',
      description: 'New product in Electronics',
      time: '1 hour ago',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: UserPlus,
      title: 'New user registered',
      description: 'john.doe@example.com',
      time: '3 hours ago',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    },
  ];

  const quickActions = [
    { icon: Plus, label: t('addProduct'), onClick: onAddProduct, variant: 'default' as const },
    { icon: Receipt, label: t('viewAllOrders'), onClick: () => {}, variant: 'outline' as const },
    { icon: UserCog, label: t('manageUsers'), onClick: () => {}, variant: 'outline' as const },
    { icon: Clock, label: t('viewAuditLogs'), onClick: onViewAuditLogs, variant: 'outline' as const },
    { icon: Settings, label: t('settings'), onClick: () => {}, variant: 'outline' as const },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Activity */}
      <Card className="lg:col-span-2 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{t('recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="w-full justify-start"
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// ProductsTab Component
interface ProductsTabProps {
  products?: Product[];
  onAddProduct: () => void;
  onDeleteProduct: (id: number) => void;
}

const ProductsTab: FC<ProductsTabProps> = ({ products, onAddProduct, onDeleteProduct }) => {
  const { t } = useTranslation();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t('productManagement')}</CardTitle>
        <Button onClick={onAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addProduct')}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('image')}</TableHead>
                <TableHead>{t('productName')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead>{t('price')}</TableHead>
                <TableHead>{t('rating')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.slice(0, 10).map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-contain rounded bg-background"
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {product.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="font-bold">${product.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      {product.rating.rate}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDeleteProduct(product.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// OrdersTab Component
const OrdersTab: FC = () => {
  const { t } = useTranslation();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{t('recentOrders')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {t('orderManagementComingSoon')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

// Main AdminDashboard Component
const AdminDashboard: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  // Mock statistics
  const stats: Stats = {
    totalProducts: products?.length || 0,
    totalOrders: 156,
    totalRevenue: 45678.90,
    activeUsers: 1234,
  };

  const handleDeleteProduct = (id: number): void => {
    if (window.confirm(t('confirmDeleteProduct'))) {
      deleteProduct(id);
    }
  };

  const handleAddProduct = (): void => {
    navigate('/admin/products/add');
  };

  const handleViewAuditLogs = (): void => {
    navigate('/admin/audit-logs');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('adminDashboard')}</h1>
        </div>
        <p className="text-muted-foreground">{t('manageYourPlatform')}</p>
      </div>

      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">{t('overview')}</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">{t('products')}</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">{t('orders')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab onAddProduct={handleAddProduct} onViewAuditLogs={handleViewAuditLogs} />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
