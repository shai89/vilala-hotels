import { getCabinById } from '@/lib/actions/cabins';
import { EditCabinClient } from './edit-cabin-client';
import { notFound } from 'next/navigation';

interface EditCabinPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCabinPage({ params }: EditCabinPageProps) {
  const resolvedParams = await params;
  const cabin = await getCabinById(resolvedParams.id);
  
  if (!cabin) {
    notFound();
  }

  return <EditCabinClient cabin={cabin} />;
}

