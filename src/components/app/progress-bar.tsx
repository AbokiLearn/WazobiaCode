import { cn } from '@/lib/utils';

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  className?: string;
}

export interface Progress {
  value: number;
  max: number;
}

export const ProgressBar = ({
  label,
  value,
  max = 100,
  color = 'bg-green-500',
  className,
}: ProgressBarProps) => {
  const percentage = (value / max) * 100;

  return (
    <div className={cn('mb-4', className)}>
      <div className="flex justify-between mb-1">
        <span className="text-md font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={cn('h-2.5 rounded-full', color)}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export const GradeProgressBar = ({
  submissionType,
  gradeProgress,
}: {
  submissionType: string;
  gradeProgress: Progress;
}) => {
  return (
    <ProgressBar
      label={submissionType}
      value={gradeProgress.value}
      max={gradeProgress.max}
      color="bg-green-500"
      className="mt-5 mb-2 flex flex-1 flex-col"
    />
  );
};
