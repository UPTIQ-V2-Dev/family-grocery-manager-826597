import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Category } from '../types/item';
import { CategoryIcon } from './CategoryIcon';

interface CategoryCardProps {
    category: Category;
    onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
    return (
        <Card
            className='hover:shadow-md transition-all cursor-pointer hover:scale-105'
            onClick={onClick}
        >
            <CardContent className='p-6'>
                <div className='flex flex-col items-center text-center space-y-4'>
                    <div className={`p-4 rounded-full ${category.color}`}>
                        <CategoryIcon
                            category={category.slug}
                            className='w-8 h-8'
                        />
                    </div>

                    <div>
                        <h3 className='font-semibold text-lg mb-2'>{category.name}</h3>
                        <Badge
                            variant='secondary'
                            className='text-xs'
                        >
                            {category.itemCount} items
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
