import React, { useState } from 'react';
import { SearchBar } from './index';

function NavBar() {
    const [dropdownOpen, setDropDownOpen] = useState(false);
    return (
        <header className="header header-transparent">
            <nav className="navbar navbar-horizontal navbar-expand-lg navbar-dark navbar-transparent border-bottom">
                <div className="container">
                    <a className="navbar-brand" href="/">
                        <img src="/logo.png" alt="logo" style={{ height: "50px", width: "auto", filter: "brightness(0) invert(1)" }} />
                    </a>
                    <div className="mx-auto">
                        <SearchBar />
                    </div>
                    <div className="collapse show">
                        <ul className="navbar-nav">
                            <li className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}>
                                <span
                                    onClick={(e) => { e.stopPropagation(); setDropDownOpen(!dropdownOpen) }}
                                    style={{ fontSize: "30px" }}
                                    className="nav-link"
                                    href="#"
                                    id="navbar-primary_dropdown_1"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded={dropdownOpen ? 'true' : 'false'}>
                                    <i className="fas fa-user-circle" />
                                </span>
                                <div className={`dropdown-menu dropdown-menu-right ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbar-primary_dropdown_1">
                                    <a className="dropdown-item" href="#">Profile</a>
                                    <a className="dropdown-item" href="#">Logout</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#">Login</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;


