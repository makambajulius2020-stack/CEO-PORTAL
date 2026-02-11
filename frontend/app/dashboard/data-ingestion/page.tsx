'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DataIngestionPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/ingestion');
    }, [router]);

    return null;
}
