import { CustomerStatus } from '../customer/entity';

export interface StatusPillProps {
  status: CustomerStatus | string;
  className?: string;
}
