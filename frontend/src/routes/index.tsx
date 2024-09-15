import { createFileRoute } from '@tanstack/react-router';

import Table from '@/videos/table';

export const Route = createFileRoute('/')({
  component: Page,
});

function Page() {
  return <Table />;
}
