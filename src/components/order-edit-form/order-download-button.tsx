import env from '~/env.mjs';
import { DownloadIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';

export default function OrderDownloadButton({
  order_id,
}: {
  order_id: number;
}) {
  async function downloadOrder() {
    const JWT_TOKEN = localStorage.getItem('auth');

    const file = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/api/order/${order_id}/export`,
      {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      },
    ).then((res) => res.blob());

    const url = window.URL.createObjectURL(file);
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
