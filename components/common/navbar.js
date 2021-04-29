import React, { useState, useEffect } from 'react';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
} from 'reactstrap';
import { SearchBar } from './index';
import { Auth, API } from 'aws-amplify';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getUser } from "../../graphql/queries";
import { Picture } from '../../components/common';

function NavBar({ pageName }) {
    const [dropdownOpen, setDropDownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);

    const cartListener = () => {
        let items = JSON.parse(window.localStorage.getItem('cart'));
        console.log(items);
        if (items) {
            setCartCount(items.length);
        }else{
            setCartCount(0);
        }
    }

    useEffect(() => {
        checkUser();
        cartListener();
        
        window.addEventListener("storage", cartListener);
        return () => window.removeEventListener("storage", cartListener);
    }, []);



    async function checkUser() {
        try {
            let id = null;
            let userData = null;
            let user = await Auth.currentAuthenticatedUser();

            if (user && user.username) {
                id = user.username;
                userData = await API.graphql({
                    query: getUser, variables: { id }
                });
                console.log(userData);
                user = { ...user, profile: userData.data.getUser }
                setUser(user);
            }

            setUser(user);
        } catch (err) {
            console.error(err);
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

                    {
                        cartCount > 0 &&
                        <Link href="/cart" as="/cart">
                            <a role="button">
                                <div className="navbar-cart">
                                    <i className="fa fa-shopping-cart" />
                                    <span>
                                        {cartCount}
                                    </span>
                                </div>
                            </a>
                        </Link>
                    }

                    {/* <!-- right most side user profile and dropdown --> */}
                    <UncontrolledDropdown className="nav-item dropdown dropdown-animate" inNavbar>
                        <DropdownToggle style={{ margin: 0 }} nav className="nav-link pr-lg-0">
                            {!user && <img alt="Image placeholder" style={{ height: "50px", width: "50px", objectFit: "cover", filter: "brightness(0) invert(1)" }} src={"/static/background/avatar.png"} />}
                            {
                                user &&
                                <div style={{ marginTop: '0' }} className="media media-pill align-items-center">
                                    <span className="avatar rounded-circle">
                                        {user && user.profile?.image && <Picture style={{ height: "50px", width: "50px", objectFit: "cover" }} path={user.profile.image} className="rounded-circle" />}
                                        {user && !user.profile?.image && <img style={{ height: "50px", width: "50px", objectFit: "cover" }} alt="Image placeholder" src={user?.session?.user?.picture ? user.session.user.picture : "/static/background/avatar.png"} />}
                                    </span>
                                    <div className="ml-2 d-none d-lg-block">
                                        {
                                            user && user.profile &&
                                            <>
                                                <span className="mb-0 text-sm text-capitalize text-white">{user.profile.firstName} {user.profile.lastName}</span>
                                            </>
                                        }
                                        {
                                            user && !user.profile && <span className="mb-0 text-sm text-white">{user?.attributes?.email ? user.attributes.email : ''}</span>
                                        }
                                    </div>
                                </div>
                            }
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu dropdown-menu-sm dropdown-menu-right dropdown-menu-arrow" right>
                            {
                                user && user.profile &&
                                <>
                                    <h6 className="dropdown-header px-0 text-capitalize">Hi, {user.profile.firstName} {user.profile.lastName}</h6>
                                </>
                            }
                            {
                                user && !user.profile && <h6 className="dropdown-header px-0 text-capitalize">Hi, {user?.attributes?.email ? user.attributes.email : ''}!</h6>
                            }
                            {
                                user && <div className="dropdown-divider"></div>
                            }
                            {
                                user &&
                                <>
                                    <Link href="/profile" as="/profile">
                                        <a role="button" className="dropdown-item">
                                            <i className="fas fa-user"></i>
                                            <span>Profile</span>
                                        </a>
                                    </Link>
                                    <span role="button" onClick={() => signOut()} className="dropdown-item">
                                        <i className="fas fa-sign-out-alt"></i>
                                        <span>Logout</span>
                                    </span>
                                </>
                            }
                            {
                                !user &&
                                <Link href="/login" as="/login">
                                    <a role="button" className="dropdown-item">
                                        <i className="fas fa-user"></i>
                                        <span>Log in</span>
                                    </a>
                                </Link>
                            }
                        </DropdownMenu>
                    </UncontrolledDropdown>

                    {/* <div className="collapse show">
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
                    </div> */}
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
