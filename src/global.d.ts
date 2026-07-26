// Global React namespace declarations
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
    interface Element {}
    interface ElementClass {
      render(): any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
    interface Element {}
  }
}

export {};
