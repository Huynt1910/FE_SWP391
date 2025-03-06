import { PublicLayout } from "@/layout/PublicLayout";
import { Error } from "@components/Error/Error";

export default function Custom404() {
  return (
    <PublicLayout breadcrumbTitle="404 Page" description="Oops!">
      <Error />
    </PublicLayout>
  );
}
