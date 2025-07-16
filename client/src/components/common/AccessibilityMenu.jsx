import { useState, useEffect } from 'react';
import styled from 'styled-components';

const AccessibilityContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const AccessibilityButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all var(--transition-fast);
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:focus {
    outline: 3px solid var(--primary-color);
    outline-offset: 2px;
  }
`;

const AccessibilityPanel = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 300px;
  background-color: var(--card-background);
  border-radius: var(--border-radius-md);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: var(--spacing-md);
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(20px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all var(--transition-normal);
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
`;

const PanelTitle = styled.h3`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    color: var(--text-color);
  }
  
  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`;

const OptionGroup = styled.div`
  margin-bottom: var(--spacing-md);
`;

const OptionTitle = styled.h4`
  margin: 0 0 var(--spacing-sm);
`;

const OptionDescription = styled.p`
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const ToggleOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background-color: ${props => props.checked ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 12px;
  transition: background-color var(--transition-fast);
  margin-right: var(--spacing-sm);
  
  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: ${props => props.checked ? '28px' : '2px'};
    transition: left var(--transition-fast);
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SliderOption = styled.div`
  margin-bottom: var(--spacing-md);
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }
  
  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`;

const SliderValue = styled.span`
  font-size: var(--font-size-small);
  font-weight: 600;
  color: var(--text-color);
  width: 30px;
  text-align: center;
`;

const ButtonOption = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
`;

const OptionButton = styled.button`
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-color)'};
  }
  
  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`;

const ResetButton = styled.button`
  width: 100%;
  padding: var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius-md);
  background-color: var(--background-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: var(--spacing-sm);
  
  &:hover {
    background-color: var(--border-color);
  }
  
  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`;

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({
    fontSize: 1, // 1 = normal, 0.9 = small, 1.1 = large, 1.2 = x-large
    highContrast: false,
    reducedMotion: false,
    dyslexicFont: false,
    lineHeight: 1.5 // Default line height
  });
  
  // Load saved preferences on mount
  useEffect(() => {
    const savedOptions = localStorage.getItem('accessibility-options');
    if (savedOptions) {
      setOptions(JSON.parse(savedOptions));
    }
  }, []);
  
  // Apply accessibility options whenever they change
  useEffect(() => {
    // Save options to localStorage
    localStorage.setItem('accessibility-options', JSON.stringify(options));
    
    // Apply font size
    document.documentElement.style.setProperty('--font-size-multiplier', options.fontSize);
    
    // Apply high contrast
    if (options.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (options.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    
    // Apply dyslexic font
    if (options.dyslexicFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
    
    // Apply line height
    document.documentElement.style.setProperty('--line-height', options.lineHeight);
  }, [options]);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  const handleFontSizeChange = (size) => {
    setOptions({
      ...options,
      fontSize: size
    });
  };
  
  const handleToggleChange = (option) => {
    setOptions({
      ...options,
      [option]: !options[option]
    });
  };
  
  const handleLineHeightChange = (e) => {
    setOptions({
      ...options,
      lineHeight: parseFloat(e.target.value)
    });
  };
  
  const resetOptions = () => {
    setOptions({
      fontSize: 1,
      highContrast: false,
      reducedMotion: false,
      dyslexicFont: false,
      lineHeight: 1.5
    });
  };
  
  return (
    <AccessibilityContainer>
      <AccessibilityButton 
        onClick={togglePanel}
        aria-label="Accessibility options"
        aria-expanded={isOpen}
      >
        <i className="fas fa-universal-access"></i>
      </AccessibilityButton>
      
      <AccessibilityPanel isOpen={isOpen}>
        <PanelHeader>
          <PanelTitle>Accessibility Options</PanelTitle>
          <CloseButton 
            onClick={togglePanel}
            aria-label="Close accessibility panel"
          >
            <i className="fas fa-times"></i>
          </CloseButton>
        </PanelHeader>
        
        <OptionGroup>
          <OptionTitle>Text Size</OptionTitle>
          <OptionDescription>
            Adjust the size of text throughout the application.
          </OptionDescription>
          <ButtonOption>
            <OptionButton 
              active={options.fontSize === 0.9}
              onClick={() => handleFontSizeChange(0.9)}
            >
              Small
            </OptionButton>
            <OptionButton 
              active={options.fontSize === 1}
              onClick={() => handleFontSizeChange(1)}
            >
              Normal
            </OptionButton>
            <OptionButton 
              active={options.fontSize === 1.1}
              onClick={() => handleFontSizeChange(1.1)}
            >
              Large
            </OptionButton>
            <OptionButton 
              active={options.fontSize === 1.2}
              onClick={() => handleFontSizeChange(1.2)}
            >
              X-Large
            </OptionButton>
          </ButtonOption>
        </OptionGroup>
        
        <OptionGroup>
          <OptionTitle>Line Spacing</OptionTitle>
          <OptionDescription>
            Adjust the space between lines of text.
          </OptionDescription>
          <SliderOption>
            <SliderContainer>
              <SliderValue>1x</SliderValue>
              <Slider 
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={options.lineHeight}
                onChange={handleLineHeightChange}
              />
              <SliderValue>2x</SliderValue>
            </SliderContainer>
          </SliderOption>
        </OptionGroup>
        
        <OptionGroup>
          <ToggleOption>
            <div>
              <OptionTitle>High Contrast</OptionTitle>
              <OptionDescription>
                Increase contrast for better readability.
              </OptionDescription>
            </div>
            <ToggleLabel>
              <ToggleInput
                type="checkbox"
                checked={options.highContrast}
                onChange={() => handleToggleChange('highContrast')}
              />
              <ToggleSwitch checked={options.highContrast} />
            </ToggleLabel>
          </ToggleOption>
        </OptionGroup>
        
        <OptionGroup>
          <ToggleOption>
            <div>
              <OptionTitle>Reduced Motion</OptionTitle>
              <OptionDescription>
                Minimize animations and transitions.
              </OptionDescription>
            </div>
            <ToggleLabel>
              <ToggleInput
                type="checkbox"
                checked={options.reducedMotion}
                onChange={() => handleToggleChange('reducedMotion')}
              />
              <ToggleSwitch checked={options.reducedMotion} />
            </ToggleLabel>
          </ToggleOption>
        </OptionGroup>
        
        <OptionGroup>
          <ToggleOption>
            <div>
              <OptionTitle>Dyslexia-Friendly Font</OptionTitle>
              <OptionDescription>
                Use a font designed for readers with dyslexia.
              </OptionDescription>
            </div>
            <ToggleLabel>
              <ToggleInput
                type="checkbox"
                checked={options.dyslexicFont}
                onChange={() => handleToggleChange('dyslexicFont')}
              />
              <ToggleSwitch checked={options.dyslexicFont} />
            </ToggleLabel>
          </ToggleOption>
        </OptionGroup>
        
        <ResetButton onClick={resetOptions}>
          Reset to Defaults
        </ResetButton>
      </AccessibilityPanel>
    </AccessibilityContainer>
  );
};

export default AccessibilityMenu;
