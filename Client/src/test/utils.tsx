import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Create a custom render function that includes providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { customRender as render };
