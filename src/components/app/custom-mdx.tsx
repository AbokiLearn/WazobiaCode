import { MDXRemote } from 'next-mdx-remote/rsc';
import CodeBlock from '@/components/app/codeblock';
import BlockQuote from '@/components/app/blockquote';

const CustomComponents = {
  a: (props: any) => (
    <a
      target="_blank"
      className="text-blue-500 hover:text-blue-600"
      {...props}
    />
  ),
  h1: (props: any) => <h1 className="text-2xl font-bold" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-4" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-4" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-bold mt-4" {...props} />,
  p: (props: any) => <p className="text-md mb-2" {...props} />,
  li: (props: any) => <li className="text-md mb-1 ml-6" {...props} />,
  ol: (props: any) => <ol className="mb-2 list-decimal" {...props} />,
  ul: (props: any) => <ul className="mb-2 list-disc" {...props} />,
  blockquote: (props: any) => <BlockQuote {...props} />,
  code: (props: any) => {
    const inPre = props.className?.startsWith('language-');
    if (inPre) {
      return <CodeBlock {...props} />;
    }
    return (
      <code
        className="px-1 py-0.5 bg-gray-100 rounded text-sm font-mono"
        {...props}
      />
    );
  },
};

export default function CustomMDX({ source }: { source: string }) {
  return <MDXRemote source={source} components={CustomComponents} />;
}
