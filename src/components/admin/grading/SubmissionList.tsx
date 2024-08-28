'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getSubmissions } from '@/lib/client/submission';
import { IHomeworkSubmission } from '@/types/db/submission';
import { formatDate } from '@/lib/utils';
import { GradingDialog } from './grading-dialog';
import { IAssignment } from '@/types/db/assignment';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ILecture } from '@/types/db/course';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SubmissionListProps {
  assignment?: IAssignment;
  assignmentType?: string;
}

interface SearchTagProps extends BadgeProps {
  onRemove: () => void;
}

const SearchTag: React.FC<SearchTagProps> = ({
  children,
  onRemove,
  className,
  ...props
}) => {
  return (
    <Badge {...props} className={cn('mr-2 mb-2', className)}>
      {children}
      <X className="ml-1 h-3 w-3 cursor-pointer" onClick={onRemove} />
    </Badge>
  );
};

const RecordsPerPageOptions = [10, 20, 50, 100];

export function SubmissionList({
  assignment,
  assignmentType,
}: SubmissionListProps) {
  const [submissions, setSubmissions] = useState<IHomeworkSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<IHomeworkSubmission | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(
    RecordsPerPageOptions[0],
  );

  // Sorting state
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const fetchedSubmissions = await getSubmissions(
        assignment?._id.toString(),
        assignmentType,
      );
      setSubmissions(fetchedSubmissions);
    };
    fetchSubmissions();
  }, [assignment, assignmentType]);

  const removeSearchParam = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if (currentPage === 0) {
      setCurrentPage(1);
    }
  }, [currentPage]);

  // Sort submissions by score
  const sortedSubmissions = useMemo(() => {
    if (sortByScore) {
      return [...submissions].sort((a, b) => {
        if (b.score === null) return -1;
        if (a.score === null) return 1;
        return b.score - a.score;
      });
    }
    return submissions;
  }, [submissions, sortByScore]);

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedSubmissions.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(sortedSubmissions.length / recordsPerPage),
  );

  // Change page
  const paginate = (pageNumber: number) => {
    if (pageNumber > totalPages) {
      setCurrentPage(1);
    } else {
      setCurrentPage(Math.max(1, pageNumber));
    }
  };

  // Toggle sort by score
  const handleSortByScore = () => {
    setSortByScore(!sortByScore);
  };

  return (
    <>
      <div className="rounded-lg bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-wrap">
            {assignment && (
              <SearchTag
                onRemove={() => removeSearchParam('assignment_id')}
                className="bg-blue-500 mr-2"
              >
                Assignment: {(assignment.lecture_id as ILecture).title}
              </SearchTag>
            )}
            {assignmentType && (
              <SearchTag
                onRemove={() => removeSearchParam('assignment_type')}
                className="bg-blue-500"
              >
                Type: {assignmentType}
              </SearchTag>
            )}
          </div>
          <Select
            value={recordsPerPage.toString()}
            onValueChange={(value) => setRecordsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Records per page" />
            </SelectTrigger>
            <SelectContent>
              {RecordsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg overflow-hidden">
          <Table className="table-fixed w-full">
            <TableHeader className="rounded-md bg-gray-300 sticky top-0 z-10">
              <TableRow className="text-lg border-b border-gray-400">
                <TableHead className="text-black-300 w-1/5 text-center">
                  Student
                </TableHead>
                <TableHead className="text-black-300 w-1/5 text-center">
                  Submitted At
                </TableHead>
                <TableHead
                  className="text-black-300 w-1/5 text-center cursor-pointer"
                  onClick={handleSortByScore}
                >
                  Score {sortByScore ? '▼' : ''}
                </TableHead>
                <TableHead className="text-black-300 w-1/5 text-center">
                  Graded At
                </TableHead>
                <TableHead className="text-black-300 w-1/5 text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <Table className="table-fixed w-full">
              <TableBody>
                {currentRecords.map((submission) => (
                  <TableRow
                    key={submission._id.toString()}
                    className="text-sm hover:bg-gray-200 border-b border-gray-400"
                  >
                    <TableCell className="w-1/5 text-center break-words">
                      {(submission as any).student_name}
                    </TableCell>
                    <TableCell className="w-1/5 text-center break-words">
                      {formatDate(submission.submitted_at)}
                    </TableCell>
                    <TableCell className="w-1/5 text-center">
                      {submission.score !== null
                        ? submission.score
                        : 'Not graded'}
                    </TableCell>
                    <TableCell className="w-1/5 text-center break-words">
                      {submission.graded_at
                        ? formatDate(submission.graded_at)
                        : 'Not graded'}
                    </TableCell>
                    <TableCell className="w-1/5 text-center">
                      <Button
                        variant="link"
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-sm underline hover:text-accent"
                      >
                        {submission.graded_at ? 'Edit Grade' : 'Grade'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={`hover:bg-gray hover:text-accent ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => paginate(index + 1)}
                  isActive={currentPage === index + 1}
                  className={`hover:bg-gray hover:text-accent hover:border-accent`}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => paginate(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                className={`hover:bg-gray hover:text-accent ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {selectedSubmission && (
        <GradingDialog
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onGraded={(updatedSubmission) => {
            setSubmissions(
              submissions.map((s) =>
                s._id === updatedSubmission._id ? updatedSubmission : s,
              ),
            );
            setSelectedSubmission(null);
          }}
        />
      )}
    </>
  );
}
