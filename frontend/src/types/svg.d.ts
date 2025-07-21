// src/types/svg.d.ts
// This file augments React's SVGProps to include commonly used SVG attributes
// that TypeScript might not recognize by default.

import React from 'react';

declare module 'react' {
  interface SVGProps<T extends SVGSVGElement> extends React.SVGProps<T> {
    fill?: string;
    stroke?: string;
    strokeWidth?: string | number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round';
    d?: string;
    viewBox?: string;
    width?: string | number;
    height?: string | number;
    className?: string; // Tailwind CSS classes
  }
}