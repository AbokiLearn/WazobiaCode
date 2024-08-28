'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import ClientMDX from './client-md';

import { IQuizAssignment } from '@/types/db/assignment';
import { IQuizAnswer } from '@/types/db/submission';
import { submitQuiz } from '@/lib/client/submission';

const createQuizSchema = (questions: IQuizAssignment['questions']) => {
  const questionFields = questions.reduce(
    (acc, _, index) => {
      acc[`question_${index}`] = z
        .number()
        .min(0)
        .max(questions[index].options.length - 1);
      return acc;
    },
    {} as Record<string, z.ZodNumber>,
  );

  return z.object(questionFields);
};

type QuizFormValues = z.infer<ReturnType<typeof createQuizSchema>>;

interface QuizComponentProps {
  quiz_id: any;
  user_id: string;
  course_id: any;
  section_id: any;
  lecture_id: any;
  questions: IQuizAssignment['questions'];
}

export function Quiz({
  quiz_id,
  user_id,
  course_id,
  section_id,
  lecture_id,
  questions,
}: QuizComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1),
  );

  // TODO: check if a submission has been made, populate the form with the answers; show grade with feedback

  const quizSchema = createQuizSchema(questions);
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: questions.reduce((acc, _, index) => {
      acc[`question_${index}`] = -1;
      return acc;
    }, {} as QuizFormValues),
  });

  const toastOpts = {
    action: {
      label: 'Close',
      onClick: () => toast.dismiss(),
    },
    duration: 5000,
  };

  const onSubmit = async (data: QuizFormValues) => {
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
      const answers: IQuizAnswer[] = Object.entries(data).map(
        ([key, value]) => {
          const question_id = questions[parseInt(key.split('_')[1])]._id;
          if (!question_id) {
            throw new Error('Question ID not found');
          }
          return {
            question_id,
            selected_option: value,
            feedback: '',
          };
        },
      );

      await submitQuiz({
        quiz_id,
        course_id,
        section_id,
        lecture_id,
        student_id: user_id,
        answers,
      });

      setSelectedAnswers(new Array(questions.length).fill(-1));
      form.reset();
      toast.success('Quiz submitted successfully', toastOpts);
    } catch (error) {
      toast.error('Error submitting quiz', toastOpts);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TODO add checks/cross for correct/wrong answers
  return (
    <div className="mt-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Challenge Exercises</h2>
        <div className="text-muted-foreground">
          Answer the following questions to test your understanding of the
          material.
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {questions.map((question, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`question_${index}`}
              render={({ field }) => (
                <FormItem className="space-y-3 border-muted border-b pb-5">
                  <FormLabel className="text-lg">
                    <ClientMDX content={question.question} />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        const newAnswers = [...selectedAnswers];
                        newAnswers[index] = parseInt(value);
                        setSelectedAnswers(newAnswers);
                        field.onChange(parseInt(value));
                      }}
                      value={selectedAnswers[index].toString()}
                      className="flex flex-col space-y-1"
                    >
                      {question.options.map((option, optionIndex) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={optionIndex}
                        >
                          <FormControl>
                            <RadioGroupItem value={optionIndex.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
