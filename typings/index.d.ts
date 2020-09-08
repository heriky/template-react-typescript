
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.less' {
    const content: { readonly [className: string]: string };
    export default content;
};
declare module '*.css' {
    const content: { readonly [className: string]: string };
    export default content;
};

declare module '*.html' {
    const tplStr: string;
    export default tplStr;
}


declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.md' {
  const content: string;
  export default content;
}


declare namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'qa';
      readonly API_HOST: string;
    }
    interface Module {
        hot: { accept: Function }
    }
}
