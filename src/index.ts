import { RouterProvider } from './context/RouterProvider';

export { useQueryParams } from './hooks/useQueryParams';
export { useQueryState } from './hooks/useQueryState';
export { useNav } from './hooks/useNav';
export { usePathMatch } from './hooks/usePathMatch';
export { PathRoute, mount } from './components/PathRoute';
export { PathLink } from './components/PathLink';
export {
  RouterProvider,
  useRouter,
  useLocation,
  useHistory,
  useWindow,
} from './context/RouterProvider';

// Legacy export for backwards compatibility
export const RouterContext = RouterProvider;
