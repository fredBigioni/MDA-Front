/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import LayersIcon from '@material-ui/icons/Layers';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import PeopleIcon from '@material-ui/icons/People';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Can from "../../../../../app/config/Can";
import { FormattedMessage } from "react-intl";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`} style={{height: '100%'}}>

        <li
            className={`menu-item menu-item-submenu ${getMenuItemActive("/administracion-mercados", true)}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/administracion-mercados">
              <span className="svg-icon menu-icon">
                <LayersIcon />
              </span>
              <span className="menu-text">
                <FormattedMessage id="MENU.MANAGE_CUSTOM_MARKET" />
              </span>
            </NavLink>
          </li>
          <Can I="view" a="menu-maestros">
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive("/maestros", true)}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to="/google-material">
                <span className="svg-icon menu-icon">
                  <ImportContactsIcon />
                </span>
                <span className="menu-text">
                  <FormattedMessage id="MENU.MASTERS" />
                </span>
                <i className="menu-arrow" />
              </NavLink>
              <div className="menu-submenu ">
                <i className="menu-arrow" />
                <ul className="menu-subnav">
                  <li className="menu-item  menu-item-parent" aria-haspopup="true">
                    <span className="menu-link">
                      <span className="menu-text">
                        <FormattedMessage id="MENU.MASTERS" />
                      </span>
                    </span>
                  </li>

                  {/* Inputs */}
                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive("/maestros/grupo-drogas", true)}`}
                    aria-haspopup="false"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/maestros/grupo-drogas"
                    >
                      <span className="menu-text">                        
                        <FormattedMessage id="MENU.MASTERS.DRUG_GROUP" />
                      </span>
                    </NavLink>
                  </li>  
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive("/maestros/grupo-laboratorios", true)}`}
                    aria-haspopup="false"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/maestros/grupo-laboratorios"
                    >
                      <span className="menu-text">                        
                        <FormattedMessage id="MENU.MASTERS.LABORATORY_GROUP" />
                      </span>
                    </NavLink>
                  </li>         
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive("/maestros/grupo-presentaciones", true)}`}
                    aria-haspopup="false"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/maestros/grupo-presentaciones"
                    >
                      <span className="menu-text">                        
                        <FormattedMessage id="MENU.MASTERS.PRODUCT_PRESENTATION_GROUP" />
                      </span>
                    </NavLink>
                  </li>                                              
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive("/maestros/grupo-productos", true)}`}
                    aria-haspopup="false"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/maestros/grupo-productos"
                    >
                      <span className="menu-text">                        
                        <FormattedMessage id="MENU.MASTERS.PRODUCT_GROUP" />
                      </span>
                    </NavLink>
                  </li>     
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive("/maestros/presentaciones", true)}`}
                    aria-haspopup="false"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/maestros/presentaciones"
                    >
                      <span className="menu-text">
                        <FormattedMessage id="MENU.MASTERS.PRODUCT_PRESENTATION" />
                      </span>
                    </NavLink>
                  </li>                                
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive("/maestros/productos", true)}`}
                    aria-haspopup="false"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/maestros/productos"
                    >
                      <span className="menu-text">
                        <FormattedMessage id="MENU.MASTERS.PRODUCT" />
                      </span>
                    </NavLink>
                  </li>
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive("/maestros/unidad-negocios", true)}`}
                    aria-haspopup="false"
                    data-menu-toggle="hover"
                  >
                    <NavLink
                      className="menu-link menu-toggle"
                      to="/maestros/unidad-negocios"
                    >
                      <span className="menu-text">                        
                        <FormattedMessage id="MENU.MASTERS.BUSINESS_UNIT" />
                      </span>
                    </NavLink>
                  </li>                  
                </ul>
              </div>
            </li>
          </Can>
          <Can I="view" a="menu-usuarios">
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive("/usuarios", true)}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to="/usuarios">
                <span className="svg-icon menu-icon">
                  <PeopleIcon />
                </span>
                <span className="menu-text">
                  <FormattedMessage id="MENU.USERS" />
                </span>
              </NavLink>
            </li>            
          </Can>

        {/*begin::1 Level*/}
        <li
          style={{bottom: '0px', width: '100%'}}
          className={`position-absolute pb-5 menu-item ${getMenuItemActive("/logout", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/logout">
            <span className="svg-icon menu-icon">
              <PowerSettingsNewIcon/>
            </span>
            <span className="menu-text">
              <FormattedMessage id="MENU.LOGOUT" />
            </span>
          </NavLink>
        </li>
        {/*end::1 Level*/}
      </ul>
      {/* end::Menu Nav */}
    </>
  );
}
