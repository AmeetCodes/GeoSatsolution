export type ProjectSpecification = {
  label: string;
  value: string;
};

export function ProjectSpecifications({ items }: { items: ProjectSpecification[] }) {
  if (!items.length) return null;

  return (
    <dl className="divide-y divide-slate-200 border-y border-slate-200">
      {items.map(({ label, value }) => (
        <div key={label} className="grid gap-1 py-4 sm:grid-cols-[minmax(10rem,0.7fr)_2fr] sm:gap-8">
          <dt className="text-sm text-slate-500">{label}</dt>
          <dd className="break-words text-sm font-medium leading-6 text-slate-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
