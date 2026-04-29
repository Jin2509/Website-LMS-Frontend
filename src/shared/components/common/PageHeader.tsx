import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  gradient?: string;
  actions?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  gradient = "from-indigo-600 via-purple-600 to-pink-600",
  actions 
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${actions ? 'flex items-center justify-between' : ''}`}>
      <div>
        <h1 className={`text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div>{actions}</div>
      )}
    </div>
  );
}