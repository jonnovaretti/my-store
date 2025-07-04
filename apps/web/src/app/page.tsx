import { Container } from '@/components/ui/container';

export default async function Home() {
  return (
    <Container className="mt-10">
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <div className="flex justify-center mt-8">list</div>
        </div>
      </div>
    </Container>
  );
}
