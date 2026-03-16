import React from 'react';
import { Nav, NavItems, NavItem } from './NavComponents';
import AIToggle from './AIToggle';

const Navbar = () => {
  return (
    <Nav>
      <NavItems>
        <NavItem>
          <AIToggle />
        </NavItem>
      </NavItems>
    </Nav>
  );
};

export default Navbar;