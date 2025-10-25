import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, X } from 'lucide-react';
import { ItemCategory, StockLevel, ItemFilters as IItemFilters } from '../types/item';
import { INDIAN_CATEGORIES } from '../data/categories';

interface ItemFiltersProps {
    filters: IItemFilters;
    onFiltersChange: (filters: IItemFilters) => void;
}

const STOCK_LEVEL_OPTIONS: { value: StockLevel; label: string }[] = [
    { value: 'high', label: 'In Stock' },
    { value: 'medium', label: 'Medium Stock' },
    { value: 'low', label: 'Low Stock' },
    { value: 'out', label: 'Out of Stock' }
];

export const ItemFilters = ({ filters, onFiltersChange }: ItemFiltersProps) => {
    const updateFilters = (updates: Partial<IItemFilters>) => {
        onFiltersChange({ ...filters, ...updates });
    };

    const clearFilters = () => {
        onFiltersChange({});
    };

    const hasActiveFilters = filters.category || filters.stockLevel || filters.search;

    return (
        <div className='bg-white p-4 border-b'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                {/* Search */}
                <div className='relative flex-1 max-w-md'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <Input
                        placeholder='Search items or brands...'
                        value={filters.search || ''}
                        onChange={e => updateFilters({ search: e.target.value })}
                        className='pl-10'
                    />
                </div>

                {/* Filters */}
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                    <div className='flex gap-2'>
                        {/* Category Filter */}
                        <Select
                            value={filters.category || 'all'}
                            onValueChange={value =>
                                updateFilters({ category: value === 'all' ? undefined : (value as ItemCategory) })
                            }
                        >
                            <SelectTrigger className='w-40'>
                                <SelectValue placeholder='All Categories' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All Categories</SelectItem>
                                {INDIAN_CATEGORIES.map(category => (
                                    <SelectItem
                                        key={category.slug}
                                        value={category.slug}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Stock Level Filter */}
                        <Select
                            value={filters.stockLevel || 'all'}
                            onValueChange={value =>
                                updateFilters({ stockLevel: value === 'all' ? undefined : (value as StockLevel) })
                            }
                        >
                            <SelectTrigger className='w-40'>
                                <SelectValue placeholder='All Stock' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All Stock</SelectItem>
                                {STOCK_LEVEL_OPTIONS.map(option => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={clearFilters}
                            className='text-gray-600'
                        >
                            <X className='w-4 h-4 mr-1' />
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
