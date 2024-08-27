'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileLink } from '@/components/app/file-link';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';

import { IHomeworkSubmission } from '@/types/db/submission';
import { updateSubmission } from '@/lib/client/submission';
import { archiveFiles } from '@/lib/client/files';
import { File as FileType } from '@/types';

interface GradingDialogProps {
  submission: IHomeworkSubmission;
  onClose: () => void;
  onGraded: (updatedSubmission: IHomeworkSubmission) => void;
}

export function GradingDialog({
  submission,
  onClose,
  onGraded,
}: GradingDialogProps) {
  const [isZipping, setIsZipping] = useState(false);
  const [score, setScore] = useState(submission.score?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');

  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSubmission = await updateSubmission(
      submission._id.toString(),
      {
        type: submission.type,
        score: parseInt(score),
        feedback,
        graded_at: new Date(),
        graded_by: user?.sub || '',
      },
    );
    onGraded(updatedSubmission);
  };

  const downloadFiles = async (files: FileType[]) => {
    setIsZipping(true);
    const archive_url = await archiveFiles(files);
    window.open(archive_url, '_blank');
    setIsZipping(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="score" className="text-right">
                Score
              </label>
              <div className="col-span-3 flex items-center">
                <div className="relative flex-grow">
                  <Input
                    id="score"
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    / {(submission.assignment_id as any).max_score}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="feedback" className="text-right">
                Feedback
              </label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div>
              <h3 className="mb-2">Submitted Files:</h3>
              <div className="flex flex-col">
                <div className="max-h-[200px] overflow-y-auto space-y-4">
                  {submission.submitted_files.map((file) => (
                    <FileLink key={file.file_key} file={file} />
                  ))}
                </div>
                {submission.submitted_files.length > 1 && (
                  <div className="relative flex items-center gap-2">
                    <Button
                      className="flex m-0 p-0 text-muted-foreground hover:text-accent"
                      variant="link"
                      onClick={() => downloadFiles(submission.submitted_files)}
                      disabled={isZipping}
                    >
                      Download All
                    </Button>
                    {isZipping && (
                      <Spinner size="small" color="text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Grade</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
