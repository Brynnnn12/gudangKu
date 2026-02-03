import type { LucideIcon } from 'lucide-react';
import { DialogDescription, DialogHeader as ShadcnDialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ModalHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function ModalHeader({ icon: Icon, title, description }: ModalHeaderProps) {
    return (
        <ShadcnDialogHeader>
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </div>
            </div>
        </ShadcnDialogHeader>
    );
}
