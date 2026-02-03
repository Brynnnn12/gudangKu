export type Role = {
    id: number;
    name: string;
    guard_name: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    roles?: Role[];
    warehouses?: Array<{ id: number; name: string }>;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    assignedWarehouses: Array<{ id: number; name: string }>;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
