import { useForm } from '@inertiajs/react';
import { Mail, Save, Shield, User } from 'lucide-react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { User as EmployeeUser } from '@/types/models/employee';

interface EditEmployeeModalProps {
    open: boolean;
    employee: EmployeeUser;
    onClose: () => void;
}

export default function EditEmployeeModal({ open, employee, onClose }: EditEmployeeModalProps) {
    const form = useForm({
        name: employee.name,
        email: employee.email,
        role: employee.roles?.[0]?.name || 'user',
    });

    useEffect(() => {
        if (open && employee) {
            form.setData({
                name: employee.name,
                email: employee.email,
                role: employee.roles?.[0]?.name || 'user',
            });
        }
    }, [employee, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/dashboard/employees/${employee.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleClose = () => {
        form.clearErrors();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Edit Employee</DialogTitle>
                                <DialogDescription>
                                    Update employee information
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <User className="h-4 w-4" />
                                <span>Basic Information</span>
                            </div>
                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="edit-name">
                                    Full Name <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="edit-name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="pl-9"
                                    />
                                </div>
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-email">
                                    Email Address <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        placeholder="john.doe@example.com"
                                        required
                                        className="pl-9"
                                    />
                                </div>
                                <InputError message={form.errors.email} />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Shield className="h-4 w-4" />
                                <span>Role & Permissions</span>
                            </div>
                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="edit-role">
                                    Role <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.role}
                                    onValueChange={(value) => form.setData('role', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-orange-500" />
                                                <span>Admin</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="user">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-blue-500" />
                                                <span>User</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.role} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
