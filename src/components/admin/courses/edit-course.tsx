'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Image from 'next/image';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.union([z.instanceof(File), z.string()]).optional(),
  cover_image: z.union([z.instanceof(File), z.string()]).optional(),
  active: z.boolean().default(false),
});

export type CourseFormValues = z.infer<typeof formSchema>;

interface EditCourseProps {
  initialData?: CourseFormValues;
  onSubmit: (data: CourseFormValues) => void;
}

export function EditCourse({ initialData, onSubmit }: EditCourseProps) {
  const [iconPreview, setIconPreview] = useState<string | null>(
    initialData?.icon as string | null,
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    initialData?.cover_image as string | null,
  );

  console.log(initialData);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      description: '',
      icon: undefined,
      cover_image: undefined,
      active: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Enter course slug" {...field} />
              </FormControl>
              <FormDescription>
                This will be used in the URL for your course
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter course description"
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
          name="icon"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                      setIconPreview(URL.createObjectURL(file));
                    }
                  }}
                  {...rest}
                />
              </FormControl>
              {iconPreview && (
                <Image
                  src={iconPreview}
                  alt="Icon preview"
                  width={64}
                  height={64}
                />
              )}
              <FormDescription>
                Upload an icon for the course (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover_image"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                      setCoverImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  {...rest}
                />
              </FormControl>
              {coverImagePreview && (
                <Image
                  src={coverImagePreview}
                  alt="Cover image preview"
                  width={64}
                  height={64}
                />
              )}
              <FormDescription>
                Upload a cover image for the course (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-muted p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Make this course visible to students
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-red-400"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
