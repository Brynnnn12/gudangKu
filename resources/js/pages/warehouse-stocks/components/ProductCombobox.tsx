import { Check, ChevronsUpDown } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/models/products';

interface ProductComboboxProps {
    value: string;
    products: Product[];
    disabled?: boolean;
    error?: string;
    emptyMessage?: string;
    labelIcon?: React.ReactNode;
    displayFormat?: 'simple' | 'detailed';
    searchPlaceholder?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChange: (productId: string) => void;
}

export default function ProductCombobox({
    value,
    products,
    disabled = false,
    error,
    emptyMessage = 'Produk tidak ditemukan.',
    labelIcon,
    displayFormat = 'simple',
    searchPlaceholder = 'Ketik nama produk atau SKU...',
    open,
    onOpenChange,
    onChange,
}: ProductComboboxProps) {
    const selectedProduct = products.find(p => p.id.toString() === value);

    const getDisplayText = () => {
        if (!selectedProduct) return 'Cari produk...';

        if (displayFormat === 'detailed') {
            return `${selectedProduct.name} - ${selectedProduct.brand} (${selectedProduct.sku})`;
        }
        return `${selectedProduct.name} - ${selectedProduct.sku}`;
    };

    const getSearchValue = (product: Product) => {
        if (displayFormat === 'detailed') {
            return `${product.name} ${product.brand} ${product.sku}`;
        }
        return `${product.name} ${product.sku}`;
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="product">
                {labelIcon}
                Produk <span className="text-destructive">*</span>
            </Label>
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        id="product"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between',
                            !value && 'text-muted-foreground'
                        )}
                    >
                        {getDisplayText()}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {products.map((product) => (
                                    <CommandItem
                                        key={product.id}
                                        value={getSearchValue(product)}
                                        onSelect={() => {
                                            onChange(product.id.toString());
                                            onOpenChange(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === product.id.toString()
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{product.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {displayFormat === 'detailed'
                                                    ? `${product.brand} | SKU: ${product.sku}`
                                                    : `SKU: ${product.sku}`
                                                }
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <InputError message={error} />
        </div>
    );
}
