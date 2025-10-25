import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';
import { CreateItemInput, ItemCategory, ItemUnit } from '../types/item';
import { INDIAN_CATEGORIES } from '../data/categories';
import { UNIT_OPTIONS } from '../utils/itemHelpers';

interface AddItemDialogProps {
    onAddItem: (item: CreateItemInput) => void;
    isLoading?: boolean;
}

export const AddItemDialog = ({ onAddItem, isLoading = false }: AddItemDialogProps) => {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<CreateItemInput>();

    const selectedCategory = watch('category');
    const selectedUnit = watch('unit');

    const onSubmit = (data: CreateItemInput) => {
        onAddItem(data);
        reset();
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Item
                </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    {/* Item Name */}
                    <div>
                        <Label htmlFor='name'>Item Name *</Label>
                        <Input
                            id='name'
                            {...register('name', { required: 'Item name is required' })}
                            placeholder='e.g., Toor Dal, Basmati Rice'
                        />
                        {errors.name && <p className='text-sm text-red-600 mt-1'>{errors.name.message}</p>}
                    </div>

                    {/* Brand */}
                    <div>
                        <Label htmlFor='brand'>Brand</Label>
                        <Input
                            id='brand'
                            {...register('brand')}
                            placeholder='e.g., Tata, Dawat, Fortune'
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <Label>Category *</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={value => setValue('category', value as ItemCategory)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                            <SelectContent>
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
                        {errors.category && <p className='text-sm text-red-600 mt-1'>Please select a category</p>}
                    </div>

                    {/* Quantity and Unit */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label htmlFor='quantity'>Quantity *</Label>
                            <Input
                                id='quantity'
                                type='number'
                                step='0.1'
                                min='0'
                                {...register('quantity', {
                                    required: 'Quantity is required',
                                    valueAsNumber: true,
                                    min: { value: 0, message: 'Quantity must be positive' }
                                })}
                                placeholder='0'
                            />
                            {errors.quantity && <p className='text-sm text-red-600 mt-1'>{errors.quantity.message}</p>}
                        </div>

                        <div>
                            <Label>Unit *</Label>
                            <Select
                                value={selectedUnit}
                                onValueChange={value => setValue('unit', value as ItemUnit)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select unit' />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNIT_OPTIONS.map(unit => (
                                        <SelectItem
                                            key={unit.value}
                                            value={unit.value}
                                        >
                                            {unit.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.unit && <p className='text-sm text-red-600 mt-1'>Please select a unit</p>}
                        </div>
                    </div>

                    {/* Min Stock Level and Price */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label htmlFor='minStockLevel'>Min Stock Level *</Label>
                            <Input
                                id='minStockLevel'
                                type='number'
                                step='0.1'
                                min='0'
                                {...register('minStockLevel', {
                                    required: 'Min stock level is required',
                                    valueAsNumber: true,
                                    min: { value: 0, message: 'Min stock level must be positive' }
                                })}
                                placeholder='0'
                            />
                            {errors.minStockLevel && (
                                <p className='text-sm text-red-600 mt-1'>{errors.minStockLevel.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor='price'>Price (₹)</Label>
                            <Input
                                id='price'
                                type='number'
                                step='0.01'
                                min='0'
                                {...register('price', {
                                    valueAsNumber: true,
                                    min: { value: 0, message: 'Price must be positive' }
                                })}
                                placeholder='0.00'
                            />
                            {errors.price && <p className='text-sm text-red-600 mt-1'>{errors.price.message}</p>}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <Label htmlFor='notes'>Notes</Label>
                        <Textarea
                            id='notes'
                            {...register('notes')}
                            placeholder='Any additional notes about this item...'
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className='flex justify-end gap-2 pt-4'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : 'Add Item'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
