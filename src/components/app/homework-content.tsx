'use client';

import { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import Markdown from 'markdown-to-jsx';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { FileLink } from '@/components/app/file-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';

import { archiveFiles, uploadFiles } from '@/lib/client/files';
import { submitHomework, getSubmissions } from '@/lib/client/submission';

import { IHomeworkAssignment } from '@/types/db/assignment';
import { IHomeworkSubmission } from '@/types/db/submission';
import { File as FileType } from '@/types/index';

const formSchema = z.object({
  comments: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

interface HomeworkProps {
  assignment_id: any;
  course_id: any;
  section_id: any;
  lecture_id: any;
  student_id: any;
  homework: IHomeworkAssignment;
}

function SubmissionsAccordion({
  submissions,
}: {
  submissions: IHomeworkSubmission[];
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {submissions.map((submission, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger>
            Submission {submissions.length - index} -{' '}
            {new Date(submission.submitted_at).toLocaleDateString()}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>
                <strong>Score:</strong>{' '}
                {submission.score !== null
                  ? `${submission.score} / ${
                      (submission.assignment_id as IHomeworkAssignment)
                        .max_score
                    }`
                  : 'Awaiting grade'}
              </p>
              {submission.submitted_files && (
                <div>
                  <strong>Files:</strong>
                  <p className="mt-1">
                    {submission.submitted_files
                      .map((file: FileType) => file.file_name)
                      .join(', ')}
                  </p>
                </div>
              )}
              {submission.comments && (
                <div>
                  <strong>Comments:</strong>
                  <p className="mt-1">{submission.comments}</p>
                </div>
              )}
              {submission.graded_at && (
                <p>
                  <strong>Graded on:</strong>{' '}
                  {new Date(submission.graded_at).toLocaleString()}
                </p>
              )}
              {submission.feedback && (
                <div className="text-green-700">
                  <strong>Feedback:</strong>
                  <p className="mt-1">{submission.feedback}</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function Homework({
  assignment_id,
  course_id,
  section_id,
  lecture_id,
  student_id,
  homework,
}: HomeworkProps) {
  const [submissions, setSubmissions] = useState<IHomeworkSubmission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comments: '',
      files: [],
    },
  });

  const toastOpts = {
    action: {
      label: 'Close',
      onClick: () => toast.dismiss(),
    },
    duration: 5000,
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const res: any = await uploadFiles(
        values.files || [],
        'homework-submissions',
      );
      const uploadedFiles = res.map((r: any) => r.data) as FileType[];

      await submitHomework({
        assignment_id,
        course_id,
        section_id,
        lecture_id,
        student_id,
        comments: values.comments || '',
        submitted_files: uploadedFiles,
      });

      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Homework submitted successfully', toastOpts);
      getSubmissions(assignment_id, student_id).then((submissions) => {
        setSubmissions(
          submissions.sort(
            (a: IHomeworkSubmission, b: IHomeworkSubmission) =>
              new Date(b.submitted_at).getTime() -
              new Date(a.submitted_at).getTime(),
          ),
        );
      });
    } catch (error) {
      toast.error('Error submitting homework', toastOpts);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadFiles = async (files: FileType[]) => {
    setIsZipping(true);
    const archive_url = await archiveFiles(files);
    window.open(archive_url, '_blank');
    setIsZipping(false);
  };

  useEffect(() => {
    getSubmissions(assignment_id, student_id).then((submissions) => {
      setSubmissions(
        submissions.sort(
          (a: IHomeworkSubmission, b: IHomeworkSubmission) =>
            new Date(b.submitted_at).getTime() -
            new Date(a.submitted_at).getTime(),
        ),
      );
    });
  }, [assignment_id, student_id]);

  if (new Date(homework.active_date) > new Date()) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">
          Homework is not active yet
        </h3>
        <p>
          The homework is not active yet. It will be available on{' '}
          {new Date(homework.active_date).toLocaleDateString()}.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Homework Instructions</h2>
        <div className="bg-gray-100 p-6 rounded-md">
          <Markdown
            options={{
              overrides: {
                li: { props: { className: 'list-disc ml-4' } },
              },
            }}
          >
            {homework.instructions}
          </Markdown>
        </div>
        <div className="bg-gray-100 font-semibold text-red-500 p-4 rounded-md">
          Due Date: {new Date(homework.due_date).toLocaleDateString()}
        </div>
      </div>

      {homework.files && homework.files.length > 0 && (
        <div className="">
          <h3 className="text-xl font-semibold mb-2">Homework Files</h3>
          <p className="text-muted-foreground">
            You may need to download these files to complete the assignment.
          </p>
          <div className="space-y-[-1%]">
            <div className="inline-flex flex-row bg-gray-100 border border-muted px-3 py-2 my-2 gap-4 rounded-md">
              {homework.files.map((file, index) => (
                <FileLink key={index} file={file} />
              ))}
            </div>
            <div className="relative flex items-center gap-2">
              <Button
                className="flex m-0 p-0 text-muted-foreground hover:text-accent"
                variant="link"
                onClick={() => downloadFiles(homework.files as FileType[])}
                disabled={isZipping}
              >
                Download All Files
              </Button>
              {isZipping && (
                <Spinner size="small" color="text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      )}

      <hr className="mt-4 mb-8 border-muted" />

      {submissions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Previous Submissions</h3>
          <SubmissionsAccordion submissions={submissions} />
        </div>
      )}

      {new Date(homework.due_date) > new Date() ? (
        <div className="border border-muted rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Submit Homework</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any comments about your submission here."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Files</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      You can submit multiple files by holding down CRTL while
                      clicking on them.
                    </p>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        required
                        ref={fileInputRef}
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          field.onChange(files);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Homework'}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="border border-muted rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Submissions Closed</h3>
          <p>
            Submissions for this assignment are closed as of{' '}
            {new Date(homework.due_date).toLocaleDateString()}.
          </p>
          <p>You can still view your previous submissions.</p>
        </div>
      )}
    </div>
  );
}
