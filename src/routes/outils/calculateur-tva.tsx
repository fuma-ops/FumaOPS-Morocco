import { createFileRoute } from '@tanstack/react-router';
import { PageShell } from '../../components/Layout';

export const Route = createFileRoute('/outils/calculateur-tva')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Calculateur de TVA</h1>
        <p className="text-slate-400">Outil en construction...</p>
      </div>
    </PageShell>
  );
}
