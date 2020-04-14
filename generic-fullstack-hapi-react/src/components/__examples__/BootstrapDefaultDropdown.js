import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const BootstrapDefaultDropdown = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret>
                    Bootstrap Default Dropdown
                </DropdownToggle> 
                <DropdownMenu>
                   <DropdownItem header>Candy</DropdownItem>  
                   <DropdownItem>Snickers</DropdownItem> 
                   <DropdownItem>M &amp;Ms</DropdownItem> 
                   <DropdownItem>KitKat</DropdownItem> 
                   <DropdownItem>3 Musketeers</DropdownItem> 
                </DropdownMenu>  
              </Dropdown> 

    );
}

export default BootstrapDefaultDropdown;