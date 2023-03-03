import React, {useState} from "react";
import {Navigate, useOutlet, Link} from 'react-router-dom';
import {useNavigate, useLocation} from "react-router-dom";
import {api_search_user} from "../services/api";

const Layout = () => {
    const navigate = useNavigate();
    const outlet = useOutlet();
    const [showLogoutDropDown, setShowLogoutDropDown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { pathname } = useLocation();
    const base = `/${pathname.slice(1).split("/").shift()}`;
    console.log("base",base);

    if(!window.localStorage.getItem('admin_token')){
        return <Navigate to="/"/>
    }

    const logout = () => {
        window.localStorage.removeItem('admin_token');
        navigate('/');
    }

    const searchUser = async () => {
        try{
            const result = await api_search_user(searchQuery);
            if(result?.status === 500){
                setShowModal(true);
                setTimeout(function(){
                    setShowModal(false);
                }, 2000);
            }
            else{
                navigate(`/user/${result.data.user._id}`);
            }

        }
        catch(exception){
            console.log('exception',exception);
        }
    }

    return(
        <div id="wrapper">
            {
                showModal &&
                <div className="modal force_show" id="exampleModal" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Search Result</h5>
                            </div>
                            <div className="modal-body">
                                <b style={{color: 'red'}}>User not found!</b>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3 loverino_logo">Loverino Admin</div>
                </a>
                <hr className="sidebar-divider my-0" />
                <li className={`nav-item ${base === '/home' ? 'active' : ''}`}>
                    <Link className="nav-link" to={'/home/1'}>
                        <i className="fas fa-fw fa-users"></i>
                        <span>Users</span>
                    </Link>
                </li>
                <li className={`nav-item ${base === '/match' ? 'active' : ''}`}>
                    <Link className="nav-link" to={'/match/1'}>
                        <i className="fas fa-fw fa-heart"></i>
                        <span>Matches</span>
                    </Link>
                </li>
                <hr className="sidebar-divider" />
                <div className="sidebar-heading">
                    Tools
                </div>
                <li className="nav-item">
                    <div className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities"
                       aria-expanded="true" aria-controls="collapseUtilities">
                        <i className="fas fa-fw fa-wrench"></i>
                        <span>Utilities</span>
                    </div>
                    <div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Custom Utilities:</h6>
                            <a className="collapse-item" href="utilities-color.html">Colors</a>
                            <a className="collapse-item" href="utilities-border.html">Borders</a>
                            <a className="collapse-item" href="utilities-animation.html">Animations</a>
                            <a className="collapse-item" href="utilities-other.html">Other</a>
                        </div>
                    </div>
                </li>
                <hr className="sidebar-divider" />
            </ul>
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        <div className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small" placeholder="Search for user...ID or email"
                                       aria-label="Search" aria-describedby="basic-addon2" onChange={e => setSearchQuery(e.target.value)}/>
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button" onClick={searchUser}>
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <ul className="navbar-nav ml-auto">
                            <div className="topbar-divider d-none d-sm-block"></div>
                            <li className={`nav-item dropdown no-arrow ${showLogoutDropDown ? 'show' : ''}`}>
                                <div className="pointer nav-link dropdown-toggle" onClick={e => setShowLogoutDropDown(!showLogoutDropDown)}>
                                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">Admin</span>
                                    <img className="img-profile rounded-circle" src="/img/undraw_profile.svg" alt="" />
                                </div>
                                <div className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${showLogoutDropDown ? 'show' : ''}`} aria-labelledby="userDropdown">
                                    <div className="pointer dropdown-item" onClick={logout}>
                                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Logout
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </nav>
                    <div className="container-fluid">
                        {outlet}
                    </div>
                </div>
                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                            <span>Copyright &copy; Your Website 2021</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>

);
}
export default Layout;