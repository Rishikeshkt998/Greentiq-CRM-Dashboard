import { z } from 'zod';

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
  phone: z.string().min(7, 'Phone number is required').regex(phoneRegex, 'Invalid phone number format'),
  company: z.string().min(1, 'Company name is required'),
  status: z.enum(['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'], {
    required_error: 'Please select a valid customer status',
  }),
  lastContactDate: z.string().min(1, 'Last contact date is required'),
  notes: z.string().optional(),
  dealValue: z.coerce.number().min(0, 'Deal value must be positive').optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
