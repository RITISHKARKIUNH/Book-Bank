import React, { useState, useEffect } from 'react';
import { SearchBar } from './index';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import Link from 'next/link';

function NavBar({ pageName }) {
    const [dropdownOpen, setDropDownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, [])

    async function checkUser() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            setUser(user);
        } catch (err) {
            setUser(null);
        }
    }

    function signOut() {
        setDropDownOpen(false);
        Auth.signOut()
            .then(data => {
                router.push('/');
                setUser(null);
            })
            .catch(err => console.log(err));
    }

    return (
        <header className={`header ${pageName === 'home' ? 'header-transparent' : 'bg-gradient-primary'}`}>
            <nav className="navbar navbar-horizontal navbar-expand-lg navbar-dark navbar-transparent border-bottom">
                <div className="container">
                    <Link href="/" as="/">
                        <a className="navbar-brand">
                            <img src="/logo.png" alt="logo" style={{ height: "50px", width: "auto", filter: "brightness(0) invert(1)" }} />
                        </a>
                    </Link>
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
                                    id="navbar-primary_dropdown_1"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded={dropdownOpen ? 'true' : 'false'}
                                >
                                    <i className="fas fa-user-circle"></i>
                                </span>
                                <div className={`dropdown-menu dropdown-menu-right ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbar-primary_dropdown_1">
                                    {
                                        user && <React.Fragment>
                                            <Link href="/profile" as="/profile">
                                                <a className="dropdown-item" >Profile</a>
                                            </Link>
                                            <div className="dropdown-divider" />
                                            <span role="button" className="cursor dropdown-item" onClick={() => signOut()}>Logout</span>
                                        </React.Fragment>
                                    }
                                    {
                                        !user && <a className="dropdown-item" href="/login">Login</a>
                                    }
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
