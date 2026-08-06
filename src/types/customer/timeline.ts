export interface CustomerActivityNote {
  id: string;
  customerId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
}
