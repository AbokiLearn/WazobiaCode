'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import * as z from 'zod';

import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { IHomeworkAssignment } from '@/types/db/assignment';
import { getAssignment } from '@/lib/client/assignment';
import { uploadFiles } from '@/lib/client/files';
import { ILecture } from '@/types/db/course';
import { File as FileType } from '@/types';

const homeworkFormSchema = z.object({
  instructions: z.string().min(1, 'Instructions are required'),
  files: z
    .array(
      z.object({
        file_url: z.string(),
        file_key: z.string(),
        file_name: z.string(),
        file_mimetype: z.string(),
      }),
    )
    .optional(),
  max_score: z
    .number()
    .min(0, 'Max score must be a positive number')
    .default(10),
  due_date: z.date(),
  active_date: z.date(),
});

export type HomeworkFormValues = z.infer<typeof homeworkFormSchema>;

export const HomeworkEditorTab = ({
  lecture,
  saveHomework,
}: {
  lecture: ILecture | null;
  saveHomework: (
    homework_id: string,
    homework: HomeworkFormValues,
  ) => Promise<IHomeworkAssignment>;
}) => {
  const [homework, setHomework] = useState<IHomeworkAssignment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<FileType[]>([]);

  const form = useForm<HomeworkFormValues>({
    resolver: zodResolver(homeworkFormSchema),
    defaultValues: {
      instructions: '',
      files: [],
      max_score: 10,
      due_date: new Date(new Date().setHours(0, 0, 0, 0)),
      active_date: new Date('2024-03-01'),
    },
  });

  useEffect(() => {
    async function fetchHomework() {
      if (!lecture?.homework_id) return;
      const { assignment } = await getAssignment(
        lecture.homework_id.toString(),
      );
      setHomework(assignment);
      setExistingFiles(assignment.files || []);

      form.reset({
        instructions: assignment.instructions,
        files: assignment.files,
        max_score: assignment.max_score,
        due_date: new Date(assignment.due_date),
        active_date: new Date(assignment.active_date),
      });
    }
    fetchHomework();
  }, [lecture, form]);

  const onSubmit = async (values: HomeworkFormValues) => {
    if (!lecture?.homework_id) return;

    setIsSubmitting(true);
    try {
      let uploadedFiles: FileType[] = [...existingFiles];

      if (selectedFiles.length > 0) {
        const uploadedFileResponses = await uploadFiles(
          selectedFiles,
          'assignment-files',
        );
        const newUploadedFiles = uploadedFileResponses.map(({ data }) => ({
          file_url: data.file_url,
          file_key: data.file_key,
          file_name: data.file_name,
          file_mimetype: data.file_mimetype,
        }));
        uploadedFiles = [...uploadedFiles, ...newUploadedFiles];
      }

      const homeworkData = {
        ...values,
        files: uploadedFiles,
      };

      const updatedHomework = await saveHomework(
        lecture.homework_id.toString(),
        homeworkData,
      );
      setHomework(updatedHomework);
      setExistingFiles(updatedHomework.files || []);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Failed to save homework:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TabsContent value="homework">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Homework</CardTitle>
          <CardDescription className="text-md mt-2">
            This is the homework for the lecture, &quot;{lecture?.title}&quot;
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter homework instructions"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? field.value.toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : null,
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    This is when the assignment becomes available to students.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? field.value.toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : null,
                        )
                      }
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
                  <FormLabel>Upload Files (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setSelectedFiles(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {(existingFiles.length > 0 || selectedFiles.length > 0) && (
                    <div>
                      <p className="text-sm text-gray-700">Included Files:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {existingFiles.map((file, index) => (
                          <li key={`existing-${index}`}>{file.file_name}</li>
                        ))}
                        {selectedFiles.map((file, index) => (
                          <li key={`selected-${index}`}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Homework'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </TabsContent>
  );
};
