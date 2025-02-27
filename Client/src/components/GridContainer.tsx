import React from 'react';

interface GridContainerProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

const GridContainer: React.FC<GridContainerProps> = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4,
  className = '',
}) => {
  // Generate responsive grid classes based on props
  const gridClasses = [
    'grid',
    `gap-${gap}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Predefined grid layouts
export const SingleColumnGrid: React.FC<Omit<GridContainerProps, 'columns'>> = (props) => (
  <GridContainer {...props} columns={{ sm: 1, md: 1, lg: 1, xl: 1 }} />
);

export const TwoColumnGrid: React.FC<Omit<GridContainerProps, 'columns'>> = (props) => (
  <GridContainer {...props} columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} />
);

export const ThreeColumnGrid: React.FC<Omit<GridContainerProps, 'columns'>> = (props) => (
  <GridContainer {...props} columns={{ sm: 1, md: 2, lg: 3, xl: 3 }} />
);

export const FourColumnGrid: React.FC<Omit<GridContainerProps, 'columns'>> = (props) => (
  <GridContainer {...props} columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} />
);

export default GridContainer;
