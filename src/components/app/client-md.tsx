import Markdown from 'markdown-to-jsx';
import CodeBlock from '@/components/app/codeblock';
import BlockQuote from '@/components/app/blockquote';

const CustomComponents = {
  a: ({ children, ...props }: any) => (
    <a target="_blank" className="text-blue-500 hover:text-blue-600" {...props}>
      {children}
    </a>
  ),
  h1: ({ children, ...props }: any) => (
    <h1 className="text-2xl font-bold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-bold mt-4" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-bold mt-4" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-lg font-bold mt-4" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-md mb-2" {...props}>
      {children}
    </p>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-md mb-1 ml-6" {...props}>
      {children}
    </li>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="mb-2 list-decimal" {...props}>
      {children}
    </ol>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="mb-2 list-disc" {...props}>
      {children}
    </ul>
  ),
  blockquote: ({ children, ...props }: any) => (
    <BlockQuote {...props}>{children}</BlockQuote>
  ),
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

export default function ClientMDX({ children }: { children: string }) {
  return (
    <Markdown options={{ overrides: CustomComponents }}>{children}</Markdown>
  );
}
