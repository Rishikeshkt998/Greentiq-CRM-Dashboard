import { z } from 'zod';
import { validatePhoneNumberForCountry } from '@/config/country-codes';

export const customerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address format'),
    countryCode: z.string().optional().default('+91'),
    phone: z.string().min(1, 'Phone number is required'),
    company: z.string().min(1, 'Company name is required'),
    status: z.enum(['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'], {
      required_error: 'Please select a valid customer status',
    }),
    lastContactDate: z.string().min(1, 'Last contact date is required'),
    notes: z.string().optional(),
    dealValue: z.coerce.number().min(0, 'Deal value must be positive').optional(),
  })
  .superRefine((data, ctx) => {
    const result = validatePhoneNumberForCountry(data.phone, data.countryCode);
    if (!result.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error,
        path: ['phone'],
      });
    }
  });

export type CustomerFormValues = z.infer<typeof customerSchema>;
