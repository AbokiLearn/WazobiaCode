'use client';

import { type JSONContent } from 'novel';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Editor from '@/components/admin/editor';

import { ILecture } from '@/types/db/course';

export const LectureEditor = ({
  lecture,
  saveLectureContent,
}: {
  lecture: ILecture | null;
  saveLectureContent: ({
    content,
    json_content,
  }: {
    content: string;
    json_content: JSONContent;
  }) => void;
}) => {
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>(
    undefined,
  );
  const [markdown, setMarkdown] = useState<string>('');
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (lecture) {
      // Reset the editor content
      setEditorContent(undefined);

      // Use setTimeout to delay the update to the next tick
      setTimeout(() => {
        setEditorContent(lecture.json_content);
        setEditorKey((prev) => prev + 1); // Force re-render of Editor
      }, 0);
    }
  }, [lecture]);

  const onEditorChange = (editor: any) => {
    setEditorContent(editor.getJSON());
    setMarkdown(editor.storage.markdown.getMarkdown());
  };

  if (!lecture) {
    return (
      <Card className="w-full bg-card shadow">
        <CardContent className="flex items-center justify-center h-[600px]">
          <p className="text-muted-foreground">Select a lecture to edit</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card shadow">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>{lecture.title}</CardTitle>
          <CardDescription className="text-md mt-2">
            {lecture.description}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button
            className="text-md hover:text-accent"
            onClick={() =>
              saveLectureContent({
                content: markdown,
                json_content: editorContent!,
              })
            }
          >
            <Save className="w-6 h-6 mr-2" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center max-h-[600px] overflow-hidden">
          <Editor
            key={editorKey}
            initialValue={editorContent}
            onChange={onEditorChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
