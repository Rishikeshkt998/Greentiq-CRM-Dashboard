export type UserRole = 'Admin' | 'Manager' | 'Viewer';

export interface PermissionMatrix {
  canViewCustomers: boolean;
  canAddCustomer: boolean;
  canEditCustomer: boolean;
  canDeleteCustomer: boolean;
  canReorderFilters: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, PermissionMatrix> = {
  Admin: {
    canViewCustomers: true,
    canAddCustomer: true,
    canEditCustomer: true,
    canDeleteCustomer: true,
    canReorderFilters: true,
  },
  Manager: {
    canViewCustomers: true,
    canAddCustomer: true,
    canEditCustomer: true,
    canDeleteCustomer: false,
    canReorderFilters: true,
  },
  Viewer: {
    canViewCustomers: true,
    canAddCustomer: false,
    canEditCustomer: false,
    canDeleteCustomer: false,
    canReorderFilters: false,
  },
};
