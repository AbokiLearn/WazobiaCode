'use client';

import { useState } from 'react';
import { type JSONContent } from 'novel';
import Editor from '@/components/admin/courses/editor';

import { defaultValue } from '@/components/admin/courses/editor/default';

export default function Page() {
  const [value, setValue] = useState<JSONContent>(defaultValue);
  const [markdown, setMarkdown] = useState<string>('');

  const onEditorChange = (editor: any) => {
    setValue(editor.getJSON());
    setMarkdown(editor.storage.markdown.getMarkdown());
    console.log(`markdown:\n${markdown}`);
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-4xl font-bold text-center">Editor</h1>
      <div className="flex flex-col h-full items-center border p-8">
        <Editor initialValue={value} onChange={onEditorChange} />
      </div>
    </div>
  );
}
