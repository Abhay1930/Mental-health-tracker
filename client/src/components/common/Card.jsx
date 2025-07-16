import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 6px var(--shadow-color);
  padding: ${props => props.padding || 'var(--spacing-lg)'};
  margin-bottom: ${props => props.marginBottom || 'var(--spacing-lg)'};
  width: ${props => props.width || '100%'};
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  
  ${props => props.hoverable && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px var(--shadow-color);
    }
  `}
  
  ${props => props.clickable && `
    cursor: pointer;
  `}
`;

const CardHeader = styled.div`
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: ${props => props.divider ? '1px solid var(--border-color)' : 'none'};
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
  margin-bottom: ${props => props.noFooter ? '0' : 'var(--spacing-md)'};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: ${props => props.divider ? '1px solid var(--border-color)' : 'none'};
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
  hoverable = false,
  clickable = false,
  padding,
  marginBottom,
  width,
  onClick,
  ...props 
}) => {
  return (
    <StyledCard 
      hoverable={hoverable} 
      clickable={clickable}
      padding={padding}
      marginBottom={marginBottom}
      width={width}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader divider={headerDivider}>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      
      <CardBody noFooter={!footer}>
        {children}
      </CardBody>
      
      {footer && (
        <CardFooter divider={footerDivider} align={footerAlign}>
          {footer}
        </CardFooter>
      )}
    </StyledCard>
  );
};

export default Card;
