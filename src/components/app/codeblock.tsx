'use client';

import React, { useEffect, useState } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-cshtml';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  const language = className
    ? className.replace(/language-/, '')
    : 'javascript';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="relative">
      <pre className={`language-${language} rounded-lg`}>
        <code>{children}</code>
      </pre>
      <Button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 hover:text-accent-foreground text-white rounded px-2 py-1 text-sm"
        variant="link"
      >
        {copied ? <CopyCheck /> : <Copy />}
      </Button>
    </div>
  );
};

export default CodeBlock;
