import { Badge } from './ui/badge';
import { StockLevel } from '../types/item';
import { getStockLevelColor, getStockLevelText } from '../utils/itemHelpers';

interface StockBadgeProps {
    stockLevel: StockLevel;
    className?: string;
}

export const StockBadge = ({ stockLevel, className = '' }: StockBadgeProps) => {
    return (
        <Badge
            variant='secondary'
            className={`${getStockLevelColor(stockLevel)} ${className}`}
        >
            {getStockLevelText(stockLevel)}
        </Badge>
    );
};
