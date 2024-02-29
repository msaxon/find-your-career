import { ComponentType, PropsWithChildren, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const SuspenseBoundary = ({ children }: PropsWithChildren) => {
  return (
    <ErrorBoundary fallback={<p>error</p>}>
      <Suspense fallback={<p>loading</p>}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export const withSuspenseBoundary = <P extends object>(
  WrappedComponent: ComponentType<P>,
) => {
  return (props: P) => {
    return (
      <SuspenseBoundary>
        <WrappedComponent {...props} />
      </SuspenseBoundary>
    );
  };
};
