import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/utils';
import LoadingSkeleton from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders card skeleton correctly', () => {
    render(<LoadingSkeleton type="card" ariaLabel="Loading test" />);
    
    // Check if the component has the correct role
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    
    // Check if the aria-label is set correctly
    expect(skeleton).toHaveAttribute('aria-label', 'Loading test');
    
    // Check if the sr-only text is present
    expect(screen.getByText('Loading test')).toBeInTheDocument();
  });

  it('renders list skeleton with correct count', () => {
    const count = 3;
    render(<LoadingSkeleton type="list" count={count} />);
    
    // Check if the component has the correct role
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    
    // Check if the correct number of list items are rendered
    const listItems = document.querySelectorAll('.animate-pulse.flex');
    expect(listItems.length).toBe(count);
  });

  it('renders text skeleton correctly', () => {
    const count = 2;
    render(<LoadingSkeleton type="text" count={count} />);
    
    // Check if the component has the correct role
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    
    // Check if the correct number of text lines are rendered
    // Count + 1 because there's an additional line at the end
    const textLines = document.querySelectorAll('.h-4.bg-gray-200');
    expect(textLines.length).toBe(count + 1);
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<LoadingSkeleton type="card" className={customClass} />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass(customClass);
  });
});
