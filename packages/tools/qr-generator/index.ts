import QRCode from 'qrcode';
import { Sale } from '@salescout/shared/types';

export class QRGenerator {
  static async generateSaleQR(sale: Sale): Promise<string> {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/sales/${sale.id}`;
    return await QRCode.toDataURL(url);
  }

  static async generateCheckinQR(saleId: string, itemId: string): Promise<string> {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/checkin?sale=${saleId}&item=${itemId}`;
    return await QRCode.toDataURL(url);
  }
}
