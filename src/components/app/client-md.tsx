import Markdown from 'markdown-to-jsx';
import React from 'react';

import CodeBlock from '@/components/app/codeblock';
import BlockQuote from '@/components/app/blockquote';

const customComponents = {
  h1: {
    component: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <h1 className="text-2xl font-bold">{children}</h1>
    ),
  },
  h2: {
    component: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <h2 className="text-xl font-bold mt-4">{children}</h2>
    ),
  },
  h3: {
    component: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <h3 className="text-lg font-bold mt-4">{children}</h3>
    ),
  },
  h4: {
    component: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <h4 className="text-md font-bold mt-4">{children}</h4>
    ),
  },
  li: {
    component: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <li className="list-decimal ml-4">{children}</li>
    ),
  },
  p: {
    component: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <p {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === 'a') {
            return React.cloneElement(
              child as React.ReactElement<{ className?: string }>,
              {
                className: 'text-blue-500 hover:text-blue-600',
              },
            );
          }
          return child;
        })}
      </p>
    ),
  },
  code: ({ children, className, ...props }: any) => {
    const inPre = className?.startsWith('lang');
    if (inPre) {
      return (
        <CodeBlock className={className} {...props}>
          {children}
        </CodeBlock>
      );
    }
    return (
      <code
        className="px-1 py-0.5 bg-gray-100 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export default function ClientMDX({ content }: { content: string }) {
  return (
    <Markdown options={{ overrides: customComponents }}>
      {/* {text} */}
      {content}
    </Markdown>
  );
}
