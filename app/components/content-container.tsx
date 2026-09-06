import type { ReactNode } from 'react';

type ContentContainerProps = {
  children: ReactNode;
  className?: string;
};

/** 页面顶部和正文开头共用的横向边界。 */
export function ContentContainer({ children, className }: ContentContainerProps) {
  return <div className={`content-container${className ? ` ${className}` : ''}`}>{children}</div>;
}
