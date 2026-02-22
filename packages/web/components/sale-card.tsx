import React from 'react';
import Link from 'next/link';
import { Sale } from '@salescout/shared/types';
import { formatDate, formatTime } from '@salescout/shared/utils/format';
import { Button } from './ui/button';

interface SaleCardProps {
  sale: Sale;
}

export const SaleCard: React.FC<SaleCardProps> = ({ sale }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{sale.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">{sale.address}, {sale.city}, {sale.state}</p>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <span>{formatDate(sale.startDate)}</span>
          <span className="mx-2">•</span>
          <span>{formatTime(sale.startTime)} - {formatTime(sale.endTime)}</span>
        </div>
        
        <p className="text-sm mb-4 line-clamp-2">{sale.description}</p>
        
        <Link href={`/sales/${sale.slug}`} passHref>
          <Button variant="primary" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};
