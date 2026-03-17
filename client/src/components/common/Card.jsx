import styled from 'styled-components';

const StyledCard = styled.div.withConfig({
  shouldForwardProp: (prop) => 
    !['hoverable', 'clickable', 'glass', 'isOpen', 'active', 'completed', 'progress', 'category', 'isPrivate', 'selected', 'checked'].includes(prop)
})`
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  padding: ${props => props.$padding || 'var(--spacing-md)'};
  margin-bottom: ${props => props.$marginBottom || 'var(--spacing-md)'};
  width: ${props => props.$width || '100%'};
  transition: all var(--transition-normal);
  overflow: hidden;
  
  ${props => props.$glass && `
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
  `}

  ${props => props.$hoverable && `
    &:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-light);
    }
  `}
  
  ${props => props.$clickable && `
    cursor: pointer;
    &:active {
      transform: translateY(-2px);
    }
  `}
`;

const CardHeader = styled.div`
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: ${props => props.$divider ? '1px solid var(--border-color)' : 'none'};
`;

const CardTitle = styled.h3`
  margin: 0;
  color: var(--text-color);
  font-size: var(--font-size-large);
  font-weight: 600;
`;

const CardSubtitle = styled.h4`
  margin: var(--spacing-xs) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-medium);
  font-weight: 400;
`;

const CardBody = styled.div`
  margin-bottom: ${props => props.$noFooter ? '0' : 'var(--spacing-md)'};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: ${props => props.$align || 'flex-end'};
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: ${props => props.$divider ? '1px solid var(--border-color)' : 'none'};
  gap: var(--spacing-sm);
`;

const Card = ({ 
  children, 
  title, 
  subtitle, 
  footer,
  headerDivider = true,
  footerDivider = true,
  footerAlign = 'flex-end',
  $hoverable = false,
  $clickable = false,
  padding,
  marginBottom,
  width,
  onClick,
  isOpen, // Filter out
  active, // Filter out
  completed, // Filter out
  progress, // Filter out
  category, // Filter out
  isPrivate, // Filter out
  selected, // Filter out
  checked, // Filter out
  ...props 
}) => {
  return (
    <StyledCard 
      $hoverable={$hoverable} 
      $clickable={$clickable}
      $padding={padding}
      $marginBottom={marginBottom}
      $width={width}
      onClick={$clickable ? onClick : undefined}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader $divider={headerDivider}>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      
      <CardBody $noFooter={!footer}>
        {children}
      </CardBody>
      
      {footer && (
        <CardFooter $divider={footerDivider} $align={footerAlign}>
          {footer}
        </CardFooter>
      )}
    </StyledCard>
  );
};

export default Card;
