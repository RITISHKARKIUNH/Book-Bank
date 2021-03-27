import React, { useEffect, useState } from 'react';
import {
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
} from 'reactstrap';
import { API, Storage, Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { PageNotFound } from '../components/common';
import Link from 'next/link';
import '../configureAmplify';

import { Picture } from '../components/common';
import { getUser } from "../graphql/queries";

export const WithProfileLayout = (WrappedComponent) => {

    const NewComponent = (props) => {
        const router = useRouter();
        const { pathname } = router;
        const [isOpen, setIsOpen] = useState(true);
        const [activeLink, setActiveLink] = useState(1);
        const [userLoading, setLoading] = useState(true);
        const toggle = () => setIsOpen(!isOpen);

        const [user, setUser] = useState(null);

        useEffect(() => {
            checkUser();

            // using switch on pathname to set active links
            switch (pathname) {
                case "/profile":
                    setActiveLink(1);
                    break;
                case "/profile/addbook":
                    setActiveLink(5);
                    break;
                case "/profile/listedbooks":
                    setActiveLink(2);
                    break;
                case "/profile/favorite":
                    setActiveLink(3);
                    break;
                case "/profile/reviews":
                    setActiveLink(4);
                    break;
                default:
                    setActiveLink(1);
                    break;
            }
        }, []);

        async function checkUser() {
            try {
                let user = await Auth.currentAuthenticatedUser();
                if (!user) {
                    router.push("/login");
                    return;
                };
                console.log(user);
                const id = user.attributes.sub;
                const userData = await API.graphql({
                    query: getUser, variables: { id }
                });

                if (userData) {
                    user = { ...user, profile: userData.data.getUser }
                }

                setUser(user);
                setLoading(false);
            } catch (err) {
                console.log(err);
                router.push("/login");
                setUser(null);
                setLoading(false);
            }
        }

        function signOut() {
            Auth.signOut()
                .then(data => {
                    router.push('/');
                })
                .catch(err => console.log(err));
        }

        if (!user && !userLoading) return <PageNotFound />;
        if (!user) return null;

        return (
            <div className="dashboard-all-minified-styles-conatiner">
                <div className={`application application-offset ready ${isOpen ? 'sidenav-pinned' : ''}`}>
                    {/* <!-- Application container --> */}
                    <div className="container-fluid container-application">
                        {/* <!-- Sidenav --> */}
                        {
                            isOpen && <div className="sidenav show" id="sidenav-main">
                                {/* <!-- Sidenav header --> */}
                                <div className="sidenav-header d-flex align-items-center">
                                    <Link href="/" as="/">
                                        <a className="navbar-brand">
                                            <img src="/logo.png" alt="logo" style={{ height: "50px", width: "auto", filter: "brightness(0) invert(1)" }} />
                                        </a>
                                    </Link>
                                    <div className="ml-auto">
                                        {/* <!-- Sidenav toggler --> */}
                                        <div className="sidenav-toggler sidenav-toggler-dark d-md-none" data-action="sidenav-unpin" data-target="#sidenav-main">
                                            <div className="sidenav-toggler-inner">
                                                <i className="sidenav-toggler-line bg-white"></i>
                                                <i className="sidenav-toggler-line bg-white"></i>
                                                <i className="sidenav-toggler-line bg-white"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- User mini profile at side bar --> */}
                                <div className="sidenav-user d-flex flex-column align-items-center justify-content-between text-center">

                                    {/* <!-- Avatar --> */}
                                    <div>
                                        <a href="/profile" className="avatar rounded-circle avatar-xl">
                                            {user && user.profile && user.profile.image ? <Picture style={{ width: "100px", height: "100px", objectFit: "cover" }} path={user.profile.image} className="rounded-circle" /> : <img alt="Image placeholder" src="/static/background/avatar.png" />}
                                        </a>
                                        <div className="mt-4">
                                            <h4 className="mb-0 text-white ">Hello</h4>
                                            {
                                                user.profile &&
                                                <>
                                                    <h5 className="mb-0 text-white text-uppercase">{user.profile.firstName} {user.profile.lastName}</h5>
                                                </>
                                            }
                                            {
                                                !user.profile && <h5 className="mb-0 text-white ">{user?.attributes?.email ? user.attributes.email : 'John Doe'}</h5>
                                            }
                                        </div>
                                    </div>

                                </div>

                                {/* <!-- Application nav --> */}
                                <div className="nav-application clearfix">
                                    <Link href="/profile" as="/profile">
                                        <a className={`btn btn-square text-sm ${activeLink === 1 ? 'active' : ''}`}>
                                            <span className="btn-inner--icon d-block"><i className="fas fa-user-circle fa-2x" ></i></span>
                                            <span className="btn-inner--icon d-block pt-2">Profile</span>
                                        </a>
                                    </Link>
                                    <Link href="/profile/addbook" as="/profile/addbook">
                                        <a className={`btn btn-square text-sm ${activeLink === 5 ? 'active' : ''}`}>
                                            <span className="btn-inner--icon d-block"><i className="fas fa-cloud-upload-alt fa-2x"></i></span>
                                            <span className="btn-inner--icon d-block pt-2">Add Book</span>
                                        </a>
                                    </Link>
                                    <Link href="/profile/listedbooks" as="/profile/listedbooks">
                                        <a className={`btn btn-square text-sm ${activeLink === 2 ? 'active' : ''}`}>
                                            <span className="btn-inner--icon d-block"><i className="fas fa-book fa-2x" ></i></span>
                                            <span className="btn-inner--icon d-block pt-2">Listed Books</span>
                                        </a>
                                    </Link>
                                    <Link href="/profile/favorite" as="/profile/favorite">
                                        <a className={`btn btn-square text-sm ${activeLink === 3 ? 'active' : ''}`}>
                                            <span className="btn-inner--icon d-block"><i className="fas fa-bookmark fa-2x" ></i></span>
                                            <span className="btn-inner--icon d-block pt-2">Favorite Books</span>
                                        </a>
                                    </Link>
                                    <Link href="/profile/reviews" as="/profile/reviews">
                                        <a className={`btn btn-square text-sm ${activeLink === 4 ? 'active' : ''}`}>
                                            <span className="btn-inner--icon d-block"><i className="far fa-star fa-2x"></i></span>
                                            <span className="btn-inner--icon d-block pt-2">Book Reviews</span>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        }
                        {/* <!-- end side nav  -->
                    <!-- Content --> */}
                        <div className="main-content position-relative">

                            {/* <!-- Main nav --> */}
                            <nav className="navbar navbar-main navbar-expand-lg navbar-dark bg-primary navbar-border" id="navbar-main" style={{ minWidth: "100%" }}>
                                <div className="container-fluid">
                                    {/* <!-- Navbar nav main top--> */}
                                    <div className="collapse navbar-collapse navbar-collapse-fade" id="navbar-main-collapse">
                                        <ul className="navbar-nav align-items-lg-center">
                                            {/* <!-- Home  --> */}
                                            <NavItem className="nav-item">
                                                <Link href="/profile" as="/profile">
                                                    <a className="nav-link pl-lg-0" style={{ cursor: "pointer" }} >profile</a>
                                                </Link>
                                            </NavItem>
                                            <NavItem className="nav-item">
                                                <Link href="/profile/addbook" as="/profile/addbook" >
                                                    <a className="nav-link pl-lg-0" style={{ cursor: "pointer" }} >add book</a>
                                                </Link>
                                            </NavItem>
                                            <NavItem className="nav-item">
                                                <Link href="/profile/listedbooks" as="/profile/listedbooks">
                                                    <a className="nav-link pl-lg-0" >listed books</a>
                                                </Link>
                                            </NavItem>
                                            <NavItem className="nav-item">
                                                <Link href="/profile/favorite" as="/profile/favorite">
                                                    <a className="nav-link pl-lg-0" style={{ cursor: "pointer" }} >favorite books</a>
                                                </Link>
                                            </NavItem>
                                            <NavItem className="nav-item">
                                                <Link href="/profile/reviews" as="/profile/reviews">
                                                    <a className="nav-link pl-lg-0" style={{ cursor: "pointer" }} >book reviews</a>
                                                </Link>
                                            </NavItem>
                                        </ul>

                                        {/* <!-- Right menu main top right--> */}
                                        <ul className="navbar-nav ml-lg-auto align-items-center d-none d-lg-flex">
                                            {/* <!-- side nav toggler --> */}
                                            <NavItem className="nav-item" className="nav-link nav-link-icon sidenav-toggler" onClick={() => toggle()}>
                                                <i className="fas fa-bars"></i>
                                            </NavItem>

                                            {/* <!-- right most side user profile and dropdown --> */}
                                            <UncontrolledDropdown className="nav-item dropdown dropdown-animate" inNavbar>
                                                <DropdownToggle style={{ margin: 0 }} nav className="nav-link pr-lg-0">
                                                    <div style={{ marginTop: '0' }} className="media media-pill align-items-center">
                                                        <span className="avatar rounded-circle">
                                                            {user && user.profile && user.profile.image ? <Picture style={{ height: "36px", width: "36px", objectFit: "cover" }} path={user.profile.image} className="rounded-circle" /> : <img alt="Image placeholder" src="/static/background/avatar.png" />}
                                                        </span>
                                                        <div className="ml-2 d-none d-lg-block">
                                                            {
                                                                user.profile &&
                                                                <>
                                                                    <span className="mb-0 text-sm text-capitalize">{user.profile.firstName} {user.profile.lastName}</span>
                                                                </>
                                                            }
                                                            {
                                                                !user.profile && <span className="mb-0 text-sm text-capitalize">{user?.attributes?.email ? user.attributes.email : 'John Doe'}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu dropdown-menu-sm dropdown-menu-right dropdown-menu-arrow" right>
                                                    {
                                                        user.profile &&
                                                        <>
                                                            <h6 className="dropdown-header px-0 text-capitalize">Hi, {user.profile.firstName} {user.profile.lastName}</h6>
                                                        </>
                                                    }
                                                    {
                                                        !user.profile && <h6 className="dropdown-header px-0 text-capitalize">Hi, {user?.attributes?.email ? user.attributes.email : 'John Doe'}!</h6>
                                                    }
                                                    <div className="dropdown-divider"></div>
                                                    <span role="button" onClick={() => signOut()} className="dropdown-item">
                                                        <i className="fas fa-sign-out-alt"></i>
                                                        <span>Logout</span>
                                                    </span>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </ul>
                                    </div>
                                </div>
                            </nav>

                            {/* <!-- Actual Page content main display--> */}
                            <div className="page-content">
                                <WrappedComponent user={user} {...props} />
                            </div>
                        </div >
                    </div >
                </div >
            </div >
        )
    }

    NewComponent.getInitialProps = async (ctx) => {
        let componentProps = {}
        if (WrappedComponent.getInitialProps) {
            componentProps = await WrappedComponent.getInitialProps(ctx);
        }

        return {
            ...componentProps,
            a: 'b'
        };
    }

    return NewComponent;
}

export default WithProfileLayout;