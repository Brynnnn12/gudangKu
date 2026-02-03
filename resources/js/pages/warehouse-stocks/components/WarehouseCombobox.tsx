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
import type { Warehouse } from '@/types/models/warehouses';

interface WarehouseComboboxProps {
    value: string;
    warehouses: Warehouse[];
    disabled?: boolean;
    error?: string;
    helperText?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChange: (warehouseId: string) => void;
}

export default function WarehouseCombobox({
    value,
    warehouses,
    disabled = false,
    error,
    helperText,
    open,
    onOpenChange,
    onChange,
}: WarehouseComboboxProps) {
    const selectedWarehouse = warehouses.find(w => w.id.toString() === value);

    return (
        <div className="space-y-2">
            <Label htmlFor="warehouse">
                Gudang <span className="text-destructive">*</span>
            </Label>
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        id="warehouse"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between',
                            !value && 'text-muted-foreground'
                        )}
                    >
                        {selectedWarehouse ? selectedWarehouse.name : 'Cari gudang...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Ketik nama gudang..." />
                        <CommandList>
                            <CommandEmpty>Gudang tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                                {warehouses.map((warehouse) => (
                                    <CommandItem
                                        key={warehouse.id}
                                        value={warehouse.name}
                                        onSelect={() => {
                                            onChange(warehouse.id.toString());
                                            onOpenChange(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === warehouse.id.toString()
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {warehouse.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <InputError message={error} />
            {helperText && (
                <p className="text-sm text-muted-foreground">{helperText}</p>
            )}
        </div>
    );
}
