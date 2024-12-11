import React, { useState } from 'react';
import SidebarItem from './SidebarItem/SidebarItem';

import PropTypes from 'prop-types';

import './sidebarStyles.scss';

function Sidebar({
  swapCardName, swapExplorerName,
}) {
    const sidebarContent = 
    [
        {
            "title": "Swap cards",
            "icon": "bi-gear-fill",
            "childrens": [
                {
                    "title": "Find a card",
                    "icon": "bi-house-fill",
                    "path": "/swap/card"
                },
                {
                    "title": "Check my requests",
                    "icon": "bi-info-circle-fill",
                    "path": "/swap/requests"
                }
            ]
        },
        {
            "title": "My cards",
            "icon": "bi-info-circle-fill",
            "childrens": [
                {
                    "title": "Report my cards",
                    "path": "/report"
                },
                {
                    "title": "Check my cards",
                    "path": "/check"
                }
            ]
        },
        {
            "title": "Profile",
            "icon": "bi-person-fill",
            "childrens": [
                {
                    "title": "Profile",
                    "path": "/profile"
                },
                {
                    "title": "Sign out",
                    "path": "/signout"
                }
            ]
        }
    ]

  return (
    <div className="sidebar">
        { sidebarContent.map((item, index) => 
            <SidebarItem key={index} item={item} />) 
        }
  </div>    
  )
};


Sidebar.propTypes = {
    title: PropTypes.string,
};

export default React.memo(Sidebar);
