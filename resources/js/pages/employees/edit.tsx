import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { EditProps } from '@/types/models/employee';

export default function Edit({ employee }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: '/dashboard/employees',
        },
        {
            title: 'Edit Employee',
            href: `/dashboard/employees/${employee.id}/edit`,
        },
    ];
    const { data, setData, put, processing, errors } = useForm({
        name: employee.name,
        email: employee.email,
        role: employee.roles?.[0]?.name || 'user',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/employees/${employee.id}`);


    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Employee" />
            <div className="p-6 max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Edit Employee</h1>
                    <p className="text-muted-foreground text-sm">Update employee information.</p>
                </div>

                <form onSubmit={submit} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
