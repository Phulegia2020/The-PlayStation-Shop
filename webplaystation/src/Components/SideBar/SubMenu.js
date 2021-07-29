//import React, { useState } from "react";
import classNames from "classnames";
import { Collapse, NavItem, NavLink } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import React, { Component } from 'react'

class SubMenu extends Component {
    state = {
        collapsed: true,
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    };

    render() {
        return (
            <div>
                <NavItem
                    onClick={this.toggle}
                    className={{ "menu-open": !this.state.collapsed }}
                >
                    <NavLink className="dropdown-toggle letter" tag={Link} to={"/admin/category"}>
                    <FontAwesomeIcon icon={this.props.icon} className="mr-2" />
                    {this.props.title}
                    </NavLink>
                </NavItem>
                <Collapse
                    isOpen={!this.state.collapsed}
                    navbar
                    className={classNames("items-menu", { "mb-1": !this.state.collapsed })}
                >
                    {this.props.items.map((item, index) => (
                    <NavItem key={index} className="pl-4">
                        <NavLink tag={Link} to={`/admin/category/${item.id}`} className="letter">
                        {item.name}
                        </NavLink>
                    </NavItem>
                    ))}
                </Collapse>
            </div>
        )
    }
}

export default SubMenu;