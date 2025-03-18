import React, { useCallback } from 'react';
import { useRouter } from '../context/RouterContext';

interface PathLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

// We use ...restProps to pass "data-" and "aria-" attributes
export function PathLink({
  to,
  children,
  className,
  ...restProps
}: PathLinkProps) {
  const { history } = useRouter();

  const handleClick = useCallback(
    (event: React.PointerEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      history.push(event.currentTarget.href);
    },
    [history],
  );

  return (
    <a href={to} className={className} onClick={handleClick} {...restProps}>
      {children}
    </a>
  );
}
