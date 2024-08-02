'use client';

import { Pencil, Plus, Send, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  createRecitationGroup,
  updateRecitationGroup,
  getRecitationGroups,
  deleteRecitationGroup,
} from '@/lib/client/course';
import {
  getRecitationInvites,
  sendInvites,
  getChannelInvites,
} from '@/lib/client/telegram';
import { IRecitationGroup } from '@/types/db/recitation-group';

// Update the form schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  student_count: z.number().min(0, 'Student count must be non-negative'),
  telegram_group_id: z.string().nullable(),
});

const RecitationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  recitation,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recitation: IRecitationGroup) => void;
  recitation: IRecitationGroup | null;
}) => {
  const isEditMode = !!recitation;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: recitation || {
      name: '',
      student_count: 0,
      telegram_group_id: null,
    },
  });

  useEffect(() => {
    if (recitation) {
      form.reset({
        name: recitation.name,
        student_count: recitation.student_count,
        telegram_group_id: recitation.telegram_group_id,
      });
    } else {
      form.reset({
        name: '',
        student_count: 0,
        telegram_group_id: null,
      });
    }
  }, [recitation, form]);

  const handleConfirm = (values: z.infer<typeof formSchema>) => {
    onConfirm({
      ...recitation,
      ...values,
    } as IRecitationGroup);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Recitation Group' : 'New Recitation Group'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Edit the recitation group details.'
              : 'Create a new recitation group.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConfirm)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="student_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telegram_group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram Group ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
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

export const Recitations = ({ courseSlug }: { courseSlug: string }) => {
  const [recitations, setRecitations] = useState<IRecitationGroup[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecitation, setEditRecitation] = useState<IRecitationGroup | null>(
    null,
  );

  useEffect(() => {
    getRecitationGroups(courseSlug).then(setRecitations).catch(console.log);
  }, [courseSlug]);

  const handleOpenDialog = (recitation: IRecitationGroup | null = null) => {
    setEditRecitation(recitation);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditRecitation(null);
  };

  const handleConfirmDialog = async (updatedRecitation: IRecitationGroup) => {
    try {
      if (editRecitation) {
        // Edit existing recitation group
        const { recitationGroup } = await updateRecitationGroup(
          courseSlug,
          editRecitation._id.toString(),
          updatedRecitation,
        );
        setRecitations(
          recitations.map((r) =>
            r._id === recitationGroup._id ? recitationGroup : r,
          ),
        );
        toast.success('Recitation group updated successfully.');
      } else {
        // Add new recitation group
        const { recitationGroup } = await createRecitationGroup(
          courseSlug,
          updatedRecitation,
        );
        setRecitations([...recitations, recitationGroup]);
        toast.success('Recitation group created successfully.');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save recitation group:', error);
      toast.error('Failed to save recitation group.');
    }
  };

  const handleDeleteRecitation = async (id: string) => {
    if (confirm('Are you sure you want to delete this recitation group?')) {
      try {
        await deleteRecitationGroup(courseSlug, id);
        const updatedRecitations = await getRecitationGroups(courseSlug);
        setRecitations(updatedRecitations);
        toast.success('Recitation group deleted successfully.');
      } catch (error) {
        console.error('Failed to delete recitation group:', error);
        toast.error('Failed to delete recitation group.');
      }
    }
  };

  const handleSendInvites = async () => {
    const groupInvites = await getRecitationInvites(
      courseSlug,
      'Welcome to WazobiaCode. We are excited to get started. Please join your recitation group. Class sessions will be conducted in the group.',
    );
    const channelInvites = await getChannelInvites(
      courseSlug,
      'Welcome to WazobiaCode. We are excited to get started. Please join our main channel to access course content.',
    );
    const invites = [...groupInvites, ...channelInvites];

    await sendInvites(invites)
      .then((res) => {
        console.log(res);
        toast.success('Invites sent successfully.');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to send invites.');
      });
  };

  return (
    <>
      <Card className="w-full bg-card shadow flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recitation Groups</CardTitle>
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
            Manage recitation groups for this course.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-4">
            {recitations.map((recitation) => (
              <div
                key={recitation._id.toString()}
                className="flex items-center justify-between px-4 py-2 border border-muted rounded hover:bg-muted"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="text-sm font-medium">
                      <Link
                        href={`/admin/students?recitation=${recitation._id.toString()}&course=${courseSlug}`}
                      >
                        {recitation.name}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-500">
                      Students: {recitation.student_count}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="link"
                    className="hover:text-accent"
                    size="icon"
                    onClick={() => handleOpenDialog(recitation)}
                  >
                    <Pencil className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="link"
                    className="hover:text-accent"
                    size="icon"
                    onClick={() =>
                      handleDeleteRecitation(recitation._id.toString())
                    }
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm font-medium text-gray-500">
            Total students:{' '}
            {recitations.reduce((acc, rec) => acc + rec.student_count, 0)}
          </p>
          <Button
            variant="outline"
            className="bg-primary text-primary-foreground hover:text-accent hover:bg-primary"
            onClick={handleSendInvites}
          >
            <Send className="w-5 h-5 mr-2" />
            Send Invites
          </Button>
        </CardFooter>
      </Card>
      <RecitationDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDialog}
        recitation={editRecitation}
      />
    </>
  );
};
