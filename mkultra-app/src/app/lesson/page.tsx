'use client';

import { useState } from 'react';
import Document from '@/components/ui/lesson/document';

const lessonPage = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return <Document />;
};

export default lessonPage;
