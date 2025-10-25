import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Grid, List, Package } from 'lucide-react';
import { ItemCard } from '../components/ItemCard';
import { CategoryCard } from '../components/CategoryCard';
import { ItemFilters } from '../components/ItemFilters';
import { AddItemDialog } from '../components/AddItemDialog';
import { itemsService } from '../services/items';
import { GroceryItem, CreateItemInput, ItemFilters as IItemFilters } from '../types/item';
import { INDIAN_CATEGORIES } from '../data/categories';

export const ItemsPage = () => {
    const [filters, setFilters] = useState<IItemFilters>({});
    const [viewMode, setViewMode] = useState<'grid' | 'categories'>('categories');
    const queryClient = useQueryClient();

    // Fetch items
    const {
        data: items = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['items', filters],
        queryFn: () => itemsService.getAllItems(filters)
    });

    // Add item mutation
    const addItemMutation = useMutation({
        mutationFn: itemsService.createItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        }
    });

    // Update stock mutation
    const updateStockMutation = useMutation({
        mutationFn: ({ itemId, newQuantity }: { itemId: string; newQuantity: number }) =>
            itemsService.updateStock(itemId, newQuantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        }
    });

    // Delete item mutation
    const deleteItemMutation = useMutation({
        mutationFn: itemsService.deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        }
    });

    const handleAddItem = (itemData: CreateItemInput) => {
        addItemMutation.mutate(itemData);
    };

    const handleUpdateStock = (itemId: string, newQuantity: number) => {
        updateStockMutation.mutate({ itemId, newQuantity });
    };

    const handleEditItem = (item: GroceryItem) => {
        // TODO: Implement edit functionality
        console.log('Edit item:', item);
    };

    const handleDeleteItem = (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteItemMutation.mutate(itemId);
        }
    };

    const handleCategoryFilter = (categorySlug: string) => {
        setFilters({ ...filters, category: categorySlug as any });
        setViewMode('grid');
    };

    // Calculate category counts
    const categoriesWithCounts = INDIAN_CATEGORIES.map(category => ({
        ...category,
        itemCount: items.filter(item => item.category === category.slug).length
    }));

    const lowStockItems = items.filter(item => item.stockLevel === 'low' || item.stockLevel === 'out');
    const totalItems = items.length;

    if (error) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-red-600 mb-2'>Error Loading Items</h2>
                    <p className='text-gray-600'>Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <div className='bg-white border-b'>
                <div className='container mx-auto px-4 py-6'>
                    <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-900'>Grocery Items</h1>
                            <p className='text-gray-600 mt-1'>Manage your household groceries and track stock levels</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            {/* Stats */}
                            <div className='flex items-center gap-6 text-sm'>
                                <div className='text-center'>
                                    <div className='font-semibold text-lg'>{totalItems}</div>
                                    <div className='text-gray-600'>Total Items</div>
                                </div>
                                <div className='text-center'>
                                    <div className='font-semibold text-lg text-orange-600'>{lowStockItems.length}</div>
                                    <div className='text-gray-600'>Low Stock</div>
                                </div>
                            </div>

                            {/* Add Item Button */}
                            <AddItemDialog
                                onAddItem={handleAddItem}
                                isLoading={addItemMutation.isPending}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <ItemFilters
                filters={filters}
                onFiltersChange={setFilters}
            />

            {/* View Toggle */}
            <div className='bg-white border-b px-4 py-3'>
                <div className='container mx-auto'>
                    <Tabs
                        value={viewMode}
                        onValueChange={value => setViewMode(value as any)}
                    >
                        <TabsList>
                            <TabsTrigger
                                value='categories'
                                className='flex items-center gap-2'
                            >
                                <Grid className='w-4 h-4' />
                                Categories
                            </TabsTrigger>
                            <TabsTrigger
                                value='grid'
                                className='flex items-center gap-2'
                            >
                                <List className='w-4 h-4' />
                                All Items
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Content */}
            <div className='container mx-auto px-4 py-6'>
                <Tabs value={viewMode}>
                    {/* Categories View */}
                    <TabsContent value='categories'>
                        {isLoading ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className='animate-pulse'
                                    >
                                        <div className='bg-white rounded-lg p-6 h-40'></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {categoriesWithCounts.map(category => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        onClick={() => handleCategoryFilter(category.slug)}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Grid View */}
                    <TabsContent value='grid'>
                        {isLoading ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className='animate-pulse'
                                    >
                                        <div className='bg-white rounded-lg p-6 h-96'></div>
                                    </div>
                                ))}
                            </div>
                        ) : items.length === 0 ? (
                            <div className='text-center py-12'>
                                <div className='text-gray-400 mb-4'>
                                    <Package className='w-16 h-16 mx-auto' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-900 mb-2'>No items found</h3>
                                <p className='text-gray-600 mb-6'>
                                    {Object.keys(filters).length > 0
                                        ? 'Try adjusting your filters or add some items to get started.'
                                        : 'Get started by adding your first grocery item.'}
                                </p>
                                <AddItemDialog
                                    onAddItem={handleAddItem}
                                    isLoading={addItemMutation.isPending}
                                />
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {items.map(item => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        onUpdateStock={handleUpdateStock}
                                        onEdit={handleEditItem}
                                        onDelete={handleDeleteItem}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
