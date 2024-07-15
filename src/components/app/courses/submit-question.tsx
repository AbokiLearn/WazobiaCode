'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
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
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { submitStudentQuestion } from '@/lib/client/student-question';

const formSchema = z.object({
  question: z.string().min(10, {
    message: 'Question must be at least 10 characters.',
  }),
});

interface SubmitQuestionProps {
  course_id: any;
  section_id: any;
  lecture_id: any;
}

export function SubmitQuestion({
  course_id,
  section_id,
  lecture_id,
}: SubmitQuestionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toastOpts = {
    action: {
      label: 'Close',
      onClick: () => toast.dismiss(),
    },
    duration: 5000,
  };

  const { user, error, isLoading } = useUser();
  if (error) {
    toast.error('Failed to fetch user', toastOpts);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  if (!user) {
    return null;
  }
  const student_id = user.sub as string;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if (typeof course_id !== 'string') {
      course_id = course_id._id;
    }
    if (typeof section_id !== 'string') {
      section_id = section_id._id;
    }
    if (typeof lecture_id !== 'string') {
      lecture_id = lecture_id._id;
    }

    try {
      await submitStudentQuestion({
        course_id,
        section_id,
        lecture_id,
        student_id,
        question: values.question,
      });
      form.reset();
      toast.success('Your question has been submitted.', toastOpts);
    } catch (error) {
      toast.error('Failed to submit question', toastOpts);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <hr className="border-muted mt-4" />
      <div className="max-w-2xl mx-auto mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your question here."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ask any question related to this lecture. Instructors will
                    get back to you shortly.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
