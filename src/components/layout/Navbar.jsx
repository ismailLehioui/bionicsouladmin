import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/apiCalls/authApiCall';
import './navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <main className="position-relative max-height-vh-100 h-100 border-radius-lg">
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm">
                  <a className="opacity-5 text-dark" href="/">Pages</a>
                </li>
                <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Tables</li>
              </ol>
              <h6 className="font-weight-bolder mb-0">Tables</h6>
            </nav>
            <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
              <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                <div className="input-group">
                  <span className="input-group-text text-body"><i className="fas fa-search" aria-hidden="true"></i></span>
                  <input type="text" className="form-control" placeholder="Type here..." />
                </div>
              </div>
              <ul className="navbar-nav justify-content-end">
                <li className="nav-item d-flex align-items-center">
                  <a className="btn btn-outline-primary btn-sm mb-0 me-3" href="https://www.bionicsoul.net" target="_blank" rel="noopener noreferrer">Bionic Soul</a>
                </li>

                {/* Dropdown Menu */}
                <li className="nav-item dropdown">
                  <span onClick={toggleDropdown} className="nav-link text-body font-weight-bold px-0" style={{ cursor: 'pointer' }}>
                    <i className="fa fa-user me-sm-1"></i>
                    <img
                      src={user?.profilePhoto.url}
                      alt="Profile"
                      className="profile-image"
                    />
                  </span>

                  {dropdownOpen && (
                    <div
                      className="dropdown-menu dropdown-menu-end show"
                      style={{ display: 'block' }}
                      ref={dropdownRef}
                    >
                      <a className="dropdown-item">{user?.name}</a>
                      <a className="dropdown-item">{user?.email}</a>
                      <Link to="/account" className="dropdown-item">Account</Link>
                      <Link to="/settings" className="dropdown-item">Settings</Link>
                      <span onClick={handleLogout} className="dropdown-item" style={{ cursor: 'pointer' }}>Logout</span>
                    </div>
                  )}
                </li>

                <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                  <a className="nav-link text-body p-0" id="iconNavbarSidenav">
                    <div className="sidenav-toggler-inner">
                      <i className="sidenav-toggler-line"></i>
                      <i className="sidenav-toggler-line"></i>
                      <i className="sidenav-toggler-line"></i>
                    </div>
                  </a>
                </li>

              </ul>
            </div>
          </div>
        </nav>
      </main>
    </div>
  );
}

export default Navbar;
