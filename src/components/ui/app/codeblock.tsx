'use client';

import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-cshtml';

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  const language = className
    ? className.replace(/language-/, '')
    : 'javascript';

  return (
    <pre className={`language-${language} rounded-lg`}>
      <code>{children}</code>
    </pre>
  );
};

export default CodeBlock;
