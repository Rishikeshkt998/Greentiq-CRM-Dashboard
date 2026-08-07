import { Suspense } from 'react';
import { DashboardContent } from '@/components/organisms/dashboard/dashboard-content';

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
