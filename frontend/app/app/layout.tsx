import { DashboardHeader } from '@/components/dashboard/header';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <> <DashboardHeader /> {children}</>;
}