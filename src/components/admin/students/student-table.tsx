'use client';

import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { IUserMetadata } from '@/types/db/user-metadata';

interface StudentTableProps {
  students: IUserMetadata[];
}

export function StudentTable({ students }: StudentTableProps) {
  const headers = [
    'Name',
    'Email',
    'Phone Number',
    'Recitation Group',
    'Overall Grade',
    'Date Joined',
  ];

  const Cohort1EndDate = new Date('2024-07-31');
  const cohort = students.map((student) =>
    new Date(student.created_at) < Cohort1EndDate
      ? 'Original Batch'
      : 'New Students',
  );

  return (
    <div className="rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary font-semibold md:text-lg hover:bg-primary">
            {headers.map((header) => (
              <TableHead key={header} className="text-primary-foreground">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow
              key={student.sub}
              className="hover:bg-muted md:text-[16px] border-b border-muted transition-colors"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/admin/students/${student.sub}`}
                  className="hover:underline"
                >
                  {`${student.first_name} ${student.last_name}`}
                </Link>
              </TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.phone_number}</TableCell>
              <TableCell>
                {student.enrollments
                  .map((enrollment) => (enrollment as any).recitation_group)
                  .join(', ')}
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={`/admin/grading/${student._id}`}>86%</Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Grades</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{cohort[index]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
