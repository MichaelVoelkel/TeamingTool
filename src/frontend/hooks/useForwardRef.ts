import { ForwardedRef, useEffect, useRef } from "react";

// taken from proposal: https://github.com/facebook/react/issues/24722
// solves the problem that a React.Ref (that's what you get insinde the component with ForwardRef)
// could actually be either a function or a reference
export const useForwardRef = <T,>(
    ref: ForwardedRef<T>,
    initialValue: any = null
  ) => {
    const targetRef = useRef<T>(initialValue);
  
    useEffect(() => {
      if (!ref) return;
  
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    }, [ref]);
  
    return targetRef;
  };