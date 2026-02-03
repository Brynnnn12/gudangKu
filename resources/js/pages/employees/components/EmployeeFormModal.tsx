import { useForm } from '@inertiajs/react';
import { Lock, Mail, Save, Shield, User } from 'lucide-react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
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

interface EmployeeFormModalProps {
    open: boolean;
    employee?: EmployeeUser | null;
    onClose: () => void;
}

export function EmployeeFormModal({ open, employee, onClose }: EmployeeFormModalProps) {
    const isEditing = !!employee;

    const form = useForm({
        name: employee?.name || '',
        email: employee?.email || '',
        role: employee?.roles?.[0]?.name || 'viewer',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (open && employee) {
            form.setData({
                name: employee.name,
                email: employee.email,
                role: employee.roles?.[0]?.name || 'viewer',
                password: '',
                password_confirmation: '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employee, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            form.put(`/dashboard/employees/${employee.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            form.post('/dashboard/employees', {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    onClose();
                },
            });
        }
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
                    <ModalHeader
                        icon={User}
                        title={isEditing ? 'Edit Karyawan' : 'Tambah Karyawan'}
                        description={isEditing ? 'Perbarui informasi karyawan' : 'Tambahkan karyawan baru ke sistem'}
                    />

                    <div className="space-y-6 py-4">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <User className="h-4 w-4" />
                                <span>Informasi Dasar</span>
                            </div>
                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor={`${isEditing ? 'edit' : 'create'}-name`}>
                                    Nama Lengkap <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id={`${isEditing ? 'edit' : 'create'}-name`}
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="Contoh: John Doe, Ahmad Suharto"
                                        required
                                        className="pl-9"
                                    />
                                </div>
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`${isEditing ? 'edit' : 'create'}-email`}>
                                    Alamat Email <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id={`${isEditing ? 'edit' : 'create'}-email`}
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        placeholder="contoh@email.com"
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
                                <span>Peran & Hak Akses</span>
                            </div>
                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor={`${isEditing ? 'edit' : 'create'}-role`}>
                                    Peran <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.role}
                                    onValueChange={(value) => form.setData('role', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih peran" />
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

                        {/* Security - Only show for create mode */}
                        {!isEditing && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Lock className="h-4 w-4" />
                                    <span>Keamanan</span>
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
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={form.processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing
                                ? (isEditing ? 'Menyimpan...' : 'Membuat...')
                                : (isEditing ? 'Perbarui' : 'Simpan')
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
