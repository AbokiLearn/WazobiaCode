'use client';

import { type JSONContent } from 'novel';
import { Save, Upload, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Editor from '@/components/admin/editor';

import { ILecture } from '@/types/db/course';
import { uploadFiles } from '@/lib/client/files';
import { File as FileType } from '@/types/index';

export const LectureEditorTab = ({
  lecture,
  saveLectureContent,
  saveLectureVideo,
}: {
  lecture: ILecture | null;
  saveLectureContent: ({
    content,
    json_content,
  }: {
    content: string;
    json_content: JSONContent;
  }) => void;
  saveLectureVideo: (video_download_url: FileType) => void;
}) => {
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>(
    undefined,
  );
  const [markdown, setMarkdown] = useState<string>('');
  const [editorKey, setEditorKey] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleVideoUpload = async () => {
    if (!videoFile) return;

    setIsUploading(true);
    try {
      const [uploadedFile] = await uploadFiles([videoFile], 'lecture-videos');
      const file = uploadedFile.data as FileType;
      await saveLectureVideo(file);
      setVideoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteLectureVideo = async () => {
    await saveLectureVideo({
      file_name: '',
      file_key: '',
      file_url: '',
      file_mimetype: '',
    });
    setVideoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setEditorKey((prev) => prev + 1);
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
    <TabsContent value="content">
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
        <div className="flex flex-col space-y-1 mb-4">
          <div className="flex items-center space-x-1">
            <Input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            />
            <Button
              onClick={handleVideoUpload}
              disabled={!videoFile || isUploading}
            >
              {isUploading ? (
                'Uploading...'
              ) : (
                <>
                  <Upload className="w-3 h-4 mr-2" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
          {lecture.video_download_url && (
            <div className="flex items-center space-x-2">
              <a
                href={lecture.video_download_url.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Watch Video
              </a>
              <a
                className="hover:text-red-500 cursor-pointer"
                onClick={deleteLectureVideo}
              >
                <Trash2 className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center max-h-[600px] overflow-hidden">
          <Editor
            key={editorKey}
            initialValue={editorContent}
            onChange={onEditorChange}
          />
        </div>
      </CardContent>
    </TabsContent>
  );
};
