import React, { ReactNode } from 'react';
import {
  Info,
  Lightbulb,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
} from 'lucide-react';

const CalloutIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'note':
      return <Info className="w-5 h-5" />;
    case 'tip':
      return <Lightbulb className="w-5 h-5" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5" />;
    case 'caution':
      return <AlertOctagon className="w-5 h-5" />;
    case 'important':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return null;
  }
};

const getContent = (children: ReactNode) => {
  let content = '';
  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      content += child;
    } else if (React.isValidElement(child)) {
      content += child.props.children || '';
    }
  });
  return content.trim();
};

export default function BlockQuote({ children }: { children: ReactNode }) {
  let type = '';
  let title = '';
  let content = getContent(children);

  if (content) {
    const match = content.match(/(\[(\w+)\])(.*?)(?:\n(.*))/);
    if (match) {
      const [_, __, capturedType, capturedTitle, capturedContent] = match;
      type = capturedType.toLowerCase();
      title = capturedTitle || type.charAt(0).toUpperCase() + type.slice(1);
      content = capturedContent || content;
    }
  }

  const bgColorClass =
    {
      note: 'bg-blue-50 border-blue-200',
      tip: 'bg-green-50 border-green-200',
      warning: 'bg-yellow-50 border-yellow-200',
      caution: 'bg-orange-50 border-orange-200',
      important: 'bg-purple-50 border-purple-200',
    }[type] || 'bg-gray-50 border-gray-200';

  const textColorClass =
    {
      note: 'text-blue-800',
      tip: 'text-green-800',
      warning: 'text-yellow-800',
      caution: 'text-orange-800',
      important: 'text-purple-800',
    }[type] || 'text-gray-800';

  return (
    <div className={`my-4 border-l-4 ${bgColorClass} p-2 rounded-r-lg`}>
      <div
        className={`flex items-center gap-2 font-semibold ${textColorClass} mb-2`}
      >
        <CalloutIcon type={type} />
        <span>{title}</span>
      </div>
      <div className={`${textColorClass} text-sm`}>{content}</div>
    </div>
  );
}
