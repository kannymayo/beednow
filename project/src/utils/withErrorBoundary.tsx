import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

type OtherProps = {
  [key: string]: any
}

export default function withErrorBoundary<IProps extends OtherProps>(
  Wrapped: React.FC<IProps>
) {
  return (props: IProps) => {
    return (
      <ErrorBoundary fallback={<></>}>
        <Wrapped {...props} />
      </ErrorBoundary>
    )
  }
}
