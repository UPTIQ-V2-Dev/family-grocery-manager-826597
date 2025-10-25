import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Minus, Plus, Edit, Trash2 } from 'lucide-react';
import { GroceryItem } from '../types/item';
import { StockBadge } from './StockBadge';
import { CategoryIcon } from './CategoryIcon';
import { formatQuantity, formatPrice, formatLastUpdated } from '../utils/itemHelpers';

interface ItemCardProps {
    item: GroceryItem;
    onUpdateStock: (itemId: string, newQuantity: number) => void;
    onEdit: (item: GroceryItem) => void;
    onDelete: (itemId: string) => void;
}

export const ItemCard = ({ item, onUpdateStock, onEdit, onDelete }: ItemCardProps) => {
    const handleDecrement = () => {
        if (item.quantity > 0) {
            onUpdateStock(item.id, item.quantity - 1);
        }
    };

    const handleIncrement = () => {
        onUpdateStock(item.id, item.quantity + 1);
    };

    return (
        <Card className='hover:shadow-md transition-shadow'>
            <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-gray-100 rounded-lg'>
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className='w-6 h-6 object-cover'
                                />
                            ) : (
                                <CategoryIcon
                                    category={item.category}
                                    className='w-6 h-6 text-gray-600'
                                />
                            )}
                        </div>
                        <div>
                            <h3 className='font-semibold text-lg'>{item.name}</h3>
                            {item.brand && <p className='text-sm text-gray-600'>{item.brand}</p>}
                        </div>
                    </div>
                    <StockBadge stockLevel={item.stockLevel} />
                </div>
            </CardHeader>

            <CardContent className='pt-0'>
                <div className='space-y-4'>
                    {/* Quantity and Price */}
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Quantity</p>
                            <p className='font-medium'>{formatQuantity(item.quantity, item.unit)}</p>
                        </div>
                        {item.price && (
                            <div className='text-right'>
                                <p className='text-sm text-gray-600'>Price</p>
                                <p className='font-medium'>{formatPrice(item.price)}</p>
                            </div>
                        )}
                    </div>

                    {/* Stock Controls */}
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleDecrement}
                            disabled={item.quantity === 0}
                            className='h-8 w-8 p-0'
                        >
                            <Minus className='w-4 h-4' />
                        </Button>
                        <span className='min-w-12 text-center font-medium'>{item.quantity}</span>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleIncrement}
                            className='h-8 w-8 p-0'
                        >
                            <Plus className='w-4 h-4' />
                        </Button>
                    </div>

                    {/* Category and Min Stock */}
                    <div className='flex items-center justify-between text-sm'>
                        <Badge
                            variant='outline'
                            className='capitalize'
                        >
                            {item.category.replace('-', ' ')}
                        </Badge>
                        <span className='text-gray-600'>Min: {formatQuantity(item.minStockLevel, item.unit)}</span>
                    </div>

                    {/* Notes */}
                    {item.notes && <p className='text-sm text-gray-600 bg-gray-50 p-2 rounded italic'>{item.notes}</p>}

                    {/* Last Updated */}
                    <div className='flex items-center justify-between text-xs text-gray-500'>
                        <span>Updated by {item.updatedBy}</span>
                        <span>{formatLastUpdated(item.lastUpdated)}</span>
                    </div>

                    {/* Actions */}
                    <div className='flex gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onEdit(item)}
                            className='flex-1'
                        >
                            <Edit className='w-4 h-4 mr-1' />
                            Edit
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onDelete(item.id)}
                            className='text-red-600 hover:text-red-700 hover:bg-red-50'
                        >
                            <Trash2 className='w-4 h-4' />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
