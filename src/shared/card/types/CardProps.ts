import type { ReactNode } from 'react';

export interface CardProps {
  title: string;
  body: string;
  children?: ReactNode;
}
