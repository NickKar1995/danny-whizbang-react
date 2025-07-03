import { Card } from 'flowbite-react';
import type { CardProps } from './types/CardProps';

// ? Εδω, δημιουργω ενα reusable Card και επιτρεπω να βαλει οτι θελει στο children. Κραταω σταθερα τα title,body
export function CardComponent({ title, body, children }: CardProps) {
  return (
    <Card className="max-w-sm">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">{body}</p>
      <div className="">{children}</div>
    </Card>
  );
}
