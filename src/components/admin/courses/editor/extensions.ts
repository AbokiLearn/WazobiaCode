import {
  AIHighlight,
  HorizontalRule,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TiptapImage,
  TiptapLink,
  UpdatedImage,
} from 'novel/extensions';
import { UploadImagesPlugin } from 'novel/plugins';

import { cx } from 'class-variance-authority';

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx('mt-4 mb-6 border-t border-muted-foreground'),
  },
});

const placeholder = Placeholder;

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx('list-disc list-outside leading-6 ml-4 space-y-1'),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx('list-decimal list-outside ml-4 space-y-2'),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx('leading-normal'),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx('border-l-4 border-primary pl-4'),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx(
        'rounded-md bg-muted text-muted-foreground border p-4 font-mono font-medium',
      ),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx('rounded-md bg-muted px-1.5 py-1 font-mono font-medium'),
      spellcheck: 'false',
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: '#DBEAFE',
    width: 4,
  },
  gapcursor: false,
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx('flex gap-2 items-start my-4'),
  },
  nested: true,
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx('not-prose pl-2 '),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx('opacity-40 rounded-lg border border-stone-200'),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted'),
  },
});

const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer',
    ),
  },
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted'),
  },
});

export const defaultExtensions = [
  horizontalRule,
  placeholder,
  starterKit,
  tiptapImage,
  tiptapLink,
  updatedImage,
  taskList,
  taskItem,
];
