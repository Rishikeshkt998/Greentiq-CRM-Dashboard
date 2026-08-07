'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customerKeys } from '@/services/customer/query-keys';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '@/services/customer/customer-service';
import { CustomerFilterState } from '@/types/filter/state';
import { CreateCustomerInput, UpdateCustomerInput, Customer } from '@/types/customer/entity';
import { PaginatedResponse } from '@/types/api/response';

export function useCustomers(filters: Partial<CustomerFilterState>, enabled: boolean = true) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => fetchCustomers(filters),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    placeholderData: (prev) => prev,
  });
}


export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerInput) => createCustomer(data),
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success(`${newCustomer.name} has been added successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add customer');
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCustomerInput) => updateCustomer(data),
    onMutate: async (updatedCustomer) => {
      await queryClient.cancelQueries({ queryKey: customerKeys.lists() });
      const previousData = queryClient.getQueriesData({ queryKey: customerKeys.lists() });

      // Optimistic update across all customer list queries
      queryClient.setQueriesData(
        { queryKey: customerKeys.lists() },
        (old: PaginatedResponse<Customer> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((c) =>
              c.id === updatedCustomer.id ? { ...c, ...updatedCustomer } : c
            ),
          };
        }
      );

      return { previousData };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || 'Failed to update customer');
    },
    onSuccess: (updatedCustomer) => {
      toast.success(`${updatedCustomer.name} has been updated!`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: customerKeys.lists() });
      const previousData = queryClient.getQueriesData({ queryKey: customerKeys.lists() });

      queryClient.setQueriesData(
        { queryKey: customerKeys.lists() },
        (old: PaginatedResponse<Customer> | undefined) => {
          if (!old) return old;
          return { ...old, data: old.data.filter((c) => c.id !== deletedId) };
        }
      );

      return { previousData };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || 'Failed to delete customer');
    },
    onSuccess: () => {
      toast.success('Customer deleted successfully!');
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}
