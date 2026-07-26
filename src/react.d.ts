declare module 'react' {
  type ReactNode = any;
  
  interface HTMLAttributes<T = HTMLElement> {
    [key: string]: any;
  }
  
  interface InputHTMLAttributes<T = HTMLInputElement> extends HTMLAttributes<T> {
    [key: string]: any;
  }
  
  interface SVGAttributes<T> {
    [key: string]: any;
  }
  
  namespace JSX {
    interface IntrinsicElements {
      // HTML elements
      div: any;
      span: any;
      a: any;
      button: any;
      input: any;
      form: any;
      label: any;
      p: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      ul: any;
      ol: any;
      li: any;
      nav: any;
      header: any;
      footer: any;
      section: any;
      article: any;
      img: any;
      table: any;
      tr: any;
      td: any;
      th: any;
      tbody: any;
      thead: any;
      [elemName: string]: any;
    }
    interface Element {}
    interface ElementClass {}
    interface ElementAttributesProperty {}
    interface ElementChildrenAttribute {}
    interface IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> {}
  }

  export function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, (action: A) => void];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useImperativeHandle<T>(ref: any, factory: () => T, deps?: any[]): void;
  export function useDebugValue<T>(value: T): void;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export function forwardRef<P, T>(component: (props: P, ref: any) => any): (props: P & { ref?: any }) => any;
  export function memo<P>(component: (props: P) => any, propsAreEqual?: (prevProps: P, nextProps: P) => boolean): (props: P) => any;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export const Fragment: any;
  
  export interface Context<T> {
    Provider: any;
    Consumer: any;
  }
}

declare module 'react-dom' {
  export const createRoot: any;
  export const createPortal: any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {}
  }
}

