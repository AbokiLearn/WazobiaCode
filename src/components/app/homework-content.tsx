'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FileLink } from '@/components/app/file-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';
import { archiveFiles, uploadFiles } from '@/lib/client/files';
import { submitHomework } from '@/lib/client/submission';
import { IHomeworkAssignment } from '@/types/db/assignment';
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

export function Homework({
  assignment_id,
  course_id,
  section_id,
  lecture_id,
  student_id,
  homework,
}: HomeworkProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

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
      const uploadedFiles = await uploadFiles(
        values.files || [],
        'homework-submissions',
      );

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
      toast.success('Homework submitted successfully', toastOpts);
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

  return (
    <div className="mt-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Homework Instructions</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          {homework.instructions}
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
    </div>
  );
}
