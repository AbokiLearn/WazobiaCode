import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function AssignmentTypeBadge({
  type,
  className = '',
}: {
  type: string;
  className?: string;
}) {
  let colorClass = '';
  let label = '';

  if (type === 'quiz') {
    colorClass = 'bg-blue-500 text-white';
    label = 'Quiz';
  } else if (type === 'homework') {
    colorClass = 'bg-green-500 text-white';
    label = 'Homework';
  }

  return (
    <Badge variant="default" className={cn(colorClass, className)}>
      {label}
    </Badge>
  );
}
