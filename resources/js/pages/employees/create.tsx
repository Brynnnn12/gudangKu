import { useForm } from '@inertiajs/react';
import { Lock, Mail, Save, Shield, User } from 'lucide-react';
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

interface CreateEmployeeModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateEmployeeModal({ open, onClose }: CreateEmployeeModalProps) {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'viewer',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/dashboard/employees', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        form.reset();
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
                                <DialogTitle>Create Employee</DialogTitle>
                                <DialogDescription>
                                    Add a new employee to the system
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
                                <Label htmlFor="create-name">
                                    Full Name <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="create-name"
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
                                <Label htmlFor="create-email">
                                    Email Address <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="create-email"
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
                                <Label htmlFor="create-role">
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

                        {/* Security */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Lock className="h-4 w-4" />
                                <span>Security</span>
                            </div>
                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="create-password">
                                    Password <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="create-password"
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="pl-9"
                                    />
                                </div>
                                <InputError message={form.errors.password} />
                                <p className="text-xs text-muted-foreground">
                                    💡 Must be at least 8 characters long
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-password-confirmation">
                                    Confirm Password <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="create-password-confirmation"
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="pl-9"
                                    />
                                </div>
                                <InputError message={form.errors.password_confirmation} />
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
                            {form.processing ? 'Creating...' : 'Create Employee'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
