import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StockInfoAlertProps {
    warehouseName?: string;
    productName?: string;
    productSku?: string;
    productUnit?: string;
    quantity: number;
}

export default function StockInfoAlert({
    warehouseName,
    productName,
    productSku,
    productUnit,
    quantity,
}: StockInfoAlertProps) {
    return (
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
                <div className="space-y-1 text-sm">
                    <div>
                        <strong>{warehouseName}</strong> - {productName}
                    </div>
                    <div>
                        SKU: {productSku} | Tersedia:{' '}
                        <strong>
                            {quantity} {productUnit}
                        </strong>
                    </div>
                </div>
            </AlertDescription>
        </Alert>
    );
}
