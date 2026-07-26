import React from 'react';

interface LoadingProps {
  text?: string;
}

const Loading = ({ text = 'Đang tải...' }: LoadingProps) => (
  <div className="flex items-center justify-center py-8 text-sm text-slate-500">
    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
    {text}
  </div>
);

export default Loading;