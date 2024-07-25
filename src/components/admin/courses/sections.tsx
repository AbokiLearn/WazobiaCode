'use client';

import { CircleCheck, CircleX, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

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
  createSection,
  updateSection,
  getSections,
  deleteSection,
} from '@/lib/client/course';
import { uploadFiles } from '@/lib/client/files';
import { cn } from '@/lib/utils';
import { ISection as SectionBase } from '@/types/db/course';

interface ISection extends Omit<SectionBase, 'icon'> {
  icon: string | File | null;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  slug: z.string().min(1, 'Slug is required'),
  active: z.boolean().default(false),
  icon: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
});

const SectionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  section,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (section: ISection) => void;
  section: ISection | null;
}) => {
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const isEditMode = !!section;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: section || {
      title: '',
      description: '',
      slug: '',
      active: false,
      icon: undefined,
    },
  });

  useEffect(() => {
    if (section) {
      form.reset({
        title: section.title,
        description: section.description,
        slug: section.slug,
        icon: section.icon,
        active: section.active,
      });
      if (typeof section.icon === 'string') {
        setIconPreview(section.icon);
      }
    } else {
      form.reset({
        title: '',
        description: '',
        slug: '',
        active: false,
        icon: undefined,
      });
      setIconPreview(null);
    }
  }, [section, form]);

  const handleConfirm = (values: z.infer<typeof formSchema>) => {
    onConfirm({
      ...section,
      ...values,
      icon: values.icon instanceof File ? values.icon : values.icon || null,
    } as ISection);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Section' : 'New Section'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Edit the section details.' : 'Create a new section.'}
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
                      width={128}
                      height={128}
                    />
                  )}
                  <FormDescription>
                    Upload an icon for the section (optional)
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
                      Make this section visible to students
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

export const Sections = ({ courseSlug }: { courseSlug: string }) => {
  const [sections, setSections] = useState<ISection[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSection, setEditSection] = useState<ISection | null>(null);

  useEffect(() => {
    getSections(courseSlug).then(setSections);
  }, [courseSlug]);

  const handleOpenDialog = (section: ISection | null = null) => {
    setEditSection(section);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditSection(null);
  };

  const handleConfirmDialog = async (updatedSection: ISection) => {
    try {
      let iconUrl: string | undefined = undefined;

      if (updatedSection.icon instanceof File) {
        const uploadResponse = await uploadFiles(
          [updatedSection.icon],
          'course-icons',
        );
        iconUrl = uploadResponse[0].data.file_url;
      } else if (typeof updatedSection.icon === 'string') {
        iconUrl = updatedSection.icon;
      }

      const sectionToSave: Partial<SectionBase> = {
        title: updatedSection.title,
        description: updatedSection.description,
        slug: updatedSection.slug,
        active: updatedSection.active,
        icon: iconUrl,
      };

      if (editSection) {
        // Edit existing section
        const { section } = await updateSection(
          courseSlug,
          editSection._id!.toString(),
          sectionToSave,
        );
        setSections(sections.map((s) => (s._id === section._id ? section : s)));
        toast.success('Section updated successfully.');
      } else {
        // Add new section
        const { section } = await createSection(courseSlug, sectionToSave);
        setSections([...sections, section]);
        toast.success('Section created successfully.');
      }
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteSection(courseSlug, id);
        const updatedSections = await getSections(courseSlug);
        setSections(updatedSections);
      } catch (error) {
        console.error('Failed to delete section:', error);
        toast.error('Failed to delete section.');
      }
    }
  };

  return (
    <>
      <Card className="w-full bg-card shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sections</CardTitle>
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
            Sections are the main content of a course. They divide your lectures
            into different sections that cover similar topics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sections.map((section) => {
              return (
                <div
                  key={section._id.toString()}
                  className="flex items-center justify-between px-4 py-2 border border-muted rounded hover:bg-muted"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        'flex-shrink-0',
                        section.active ? 'text-green-700' : 'text-red-700',
                      )}
                    >
                      {section.active ? (
                        <CircleCheck className="w-5 h-5" />
                      ) : (
                        <CircleX className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        <Link
                          href={`/admin/courses/${courseSlug}/${section.slug}`}
                        >
                          {section.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">
                        {section.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="link"
                      className="hover:text-accent"
                      size="icon"
                      onClick={() => handleOpenDialog(section)}
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="link"
                      className="hover:text-accent"
                      size="icon"
                      onClick={() =>
                        handleDeleteSection(section._id.toString())
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
      <SectionDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDialog}
        section={editSection}
      />
    </>
  );
};
