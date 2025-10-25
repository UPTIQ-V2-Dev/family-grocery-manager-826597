import {
    Wheat,
    Flame,
    Droplets,
    Leaf,
    Apple,
    Milk,
    Package,
    Sparkles,
    SprayCan,
    Cookie,
    LucideIcon
} from 'lucide-react';
import { ItemCategory } from '../types/item';

interface CategoryIconProps {
    category: ItemCategory;
    className?: string;
}

const CATEGORY_ICONS: Record<ItemCategory, LucideIcon> = {
    dal: Wheat,
    rice: Wheat,
    spices: Flame,
    oil: Droplets,
    vegetables: Leaf,
    fruits: Apple,
    dairy: Milk,
    snacks: Cookie,
    condiments: Package,
    soap: Sparkles,
    cleaning: SprayCan,
    others: Package
};

export const CategoryIcon = ({ category, className = '' }: CategoryIconProps) => {
    const IconComponent = CATEGORY_ICONS[category];

    return <IconComponent className={className} />;
};
