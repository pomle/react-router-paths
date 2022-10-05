import React, { useCallback } from 'react';
import { useRouter } from '../context/RouterContext';

interface PathLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function PathLink({ to, children, className }: PathLinkProps) {
  const { history } = useRouter();

  const handleClick = useCallback(
    (event: React.PointerEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      history.push(event.currentTarget.href);
    },
    [history],
  );

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
