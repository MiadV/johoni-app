import { DownloadIcon } from 'lucide-react';

import axios from '~/lib/axios';
import { Button } from '~/components/ui/button';

export default function OrderDownloadButton({
  order_id,
}: {
  order_id: number;
}) {
  async function downloadOrder() {
    const file = await axios<Blob>(`/api/order/${order_id}/export`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(file.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${order_id}.xlsx`;
    a.click();
  }
  return (
    <Button variant="outline" onClick={downloadOrder}>
      <DownloadIcon className="mr-2" />
      Download
    </Button>
  );
}
