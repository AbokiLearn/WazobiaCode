'use client';

import { CircleCheck, CircleX, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

import {
  getLectures,
  createLecture,
  updateLecture,
  deleteLecture,
} from '@/lib/client/course';
import { cn } from '@/lib/utils';
import { ILecture } from '@/types/db/course';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  slug: z.string().min(1, 'Slug is required'),
  active: z.boolean().default(false),
  video_url: z.string(),
  has_quiz: z.boolean().default(false),
  has_homework: z.boolean().default(false),
});

const LectureDialog = ({
  isOpen,
  onClose,
  onConfirm,
  lecture,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lecture: ILecture) => void;
  lecture: ILecture | null;
}) => {
  const isEditMode = !!lecture;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: lecture
      ? {
          ...lecture,
        }
      : {
          title: '',
          description: '',
          slug: '',
          active: false,
          video_url: '',
          has_quiz: false,
          has_homework: false,
        },
  });

  useEffect(() => {
    if (lecture) {
      form.reset({
        title: lecture.title,
        description: lecture.description,
        slug: lecture.slug,
        active: lecture.active,
        video_url: lecture.video_url,
        has_quiz: lecture.has_quiz,
        has_homework: lecture.has_homework,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        slug: '',
        active: false,
        video_url: '',
        has_quiz: false,
        has_homework: false,
      });
    }
  }, [lecture, form]);

  const handleConfirm = (values: z.infer<typeof formSchema>) => {
    if (values.active && !lecture?.content) {
      form.setError('active', {
        type: 'manual',
        message: 'Cannot set lecture to active without content',
      });
      return;
    }
    onConfirm({
      ...lecture,
      ...values,
    } as unknown as ILecture);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Lecture' : 'New Lecture'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Edit the lecture details.' : 'Create a new lecture.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConfirm)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Textarea {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assignments</h3>
              <FormField
                control={form.control}
                name="has_quiz"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-muted p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Quiz</FormLabel>
                      <FormDescription>
                        Add a quiz to this lecture
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="has_homework"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-muted p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Homework</FormLabel>
                      <FormDescription>
                        Add homework to this lecture
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex flex-row items-center justify-between rounded-lg border border-muted p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Make this lecture visible to students
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (!lecture?.content || !lecture?.json_content) {
                              form.setError('active', {
                                type: 'manual',
                                message:
                                  'Cannot set lecture to active without content. Use the editor to add content.',
                              });
                            } else {
                              form.clearErrors('active');
                              field.onChange(checked);
                            }
                          } else {
                            form.clearErrors('active');
                            field.onChange(checked);
                          }
                        }}
                        className="data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-red-400"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div
              className={cn(
                'flex items-center justify-between my-2 py-2 px-4 rounded-lg',
                lecture?.content && lecture?.json_content
                  ? 'bg-green-100'
                  : 'bg-red-100',
              )}
            >
              <FormLabel className="text-base">Has Content</FormLabel>
              {!!lecture?.content && !!lecture?.json_content ? (
                <CircleCheck className="w-6 h-6 text-green-700" />
              ) : (
                <CircleX className="w-6 h-6 text-red-700" />
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const Lectures = ({
  courseSlug,
  sectionSlug,
  setEditingLecture,
  editingLecture,
}: {
  courseSlug: string;
  sectionSlug: string;
  setEditingLecture: (lecture: ILecture | null) => void;
  editingLecture: ILecture | null;
}) => {
  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLectureMetadata, setEditLectureMetadata] =
    useState<ILecture | null>(null);

  useEffect(() => {
    getLectures(courseSlug, sectionSlug).then(setLectures);
  }, [courseSlug, sectionSlug]);

  useEffect(() => {
    if (!editingLecture) {
      console.log('fetching lectures');
      getLectures(courseSlug, sectionSlug).then(setLectures);
    }
  }, [editingLecture, courseSlug, sectionSlug]);

  const handleOpenDialog = (lecture: ILecture | null = null) => {
    setEditLectureMetadata(lecture);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditLectureMetadata(null);
  };

  const handleConfirmDialog = async (updatedLecture: ILecture) => {
    try {
      const lectureToSave: Partial<ILecture> = {
        title: updatedLecture.title,
        description: updatedLecture.description,
        slug: updatedLecture.slug,
        active: updatedLecture.active,
        video_url: updatedLecture.video_url,
        has_quiz: updatedLecture.has_quiz,
        has_homework: updatedLecture.has_homework,
      };

      console.log(lectureToSave);

      if (editLectureMetadata) {
        // Edit existing lecture
        const { lecture } = await updateLecture(
          courseSlug,
          sectionSlug,
          editLectureMetadata._id!.toString(),
          lectureToSave,
        );
        setLectures(lectures.map((s) => (s._id === lecture._id ? lecture : s)));
        toast.success('Lecture updated successfully.');
      } else {
        // Add new lecture
        const { lecture } = await createLecture(
          courseSlug,
          sectionSlug,
          lectureToSave,
        );
        setLectures([...lectures, lecture]);
        toast.success('Lecture created successfully.');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save lecture:', error);
      toast.error('Failed to save lecture.');
    }
  };

  const handleDeleteLecture = async (id: string) => {
    if (confirm('Are you sure you want to delete this lecture?')) {
      try {
        await deleteLecture(courseSlug, sectionSlug, id);
        const updatedLectures = await getLectures(courseSlug, sectionSlug);
        setLectures(updatedLectures);
        if (editingLecture?._id.toString() === id) {
          setEditingLecture(null);
        }
      } catch (error) {
        console.error('Failed to delete lecture:', error);
        toast.error('Failed to delete lecture.');
      }
    }
  };

  return (
    <>
      <Card className="w-full bg-card shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lectures</CardTitle>
            <Button
              variant="link"
              className="hover:text-accent"
              size="icon"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
          <CardDescription>
            Lectures are the main content of a section. They are the main
            content of a course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lectures.map((lecture) => {
              const isEditing = editingLecture?._id === lecture._id;
              return (
                <div
                  key={lecture._id.toString()}
                  className={cn(
                    'flex items-center justify-between px-4 py-2 border border-muted rounded hover:bg-muted',
                    isEditing && 'bg-muted border-accent',
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        'flex-shrink-0',
                        lecture.active ? 'text-green-700' : 'text-red-700',
                      )}
                    >
                      {lecture.active ? (
                        <CircleCheck className="w-5 h-5" />
                      ) : (
                        <CircleX className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        <Button
                          variant="link"
                          className="hover:text-accent p-0 h-auto whitespace-normal text-left"
                          onClick={() => setEditingLecture(lecture)}
                        >
                          {lecture.title}
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {lecture.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="link"
                      className="hover:text-accent"
                      size="icon"
                      onClick={() => handleOpenDialog(lecture)}
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="link"
                      className="hover:text-accent"
                      size="icon"
                      onClick={() =>
                        handleDeleteLecture(lecture._id.toString())
                      }
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <LectureDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDialog}
        lecture={editLectureMetadata}
      />
    </>
  );
};
