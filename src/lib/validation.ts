import { z } from 'zod'

export const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  contact_number: z.string().min(8, 'Contact number is too short'),
  calling_number: z.string().min(8, 'Calling number is too short'),
  state: z.string().min(2, 'State name is too short'),
  city: z.string().min(2, 'City name is too short'),
  problem_statement: z.string().min(10, 'Please specify your problem statement (minimum 10 characters)'),
  more_details: z.string().optional(),
  services_required: z.array(z.string()).min(1, 'Please select at least one service'),
  honeypot: z.string().optional(), // For bot detection
})

export type LeadFormInput = z.infer<typeof leadFormSchema>
