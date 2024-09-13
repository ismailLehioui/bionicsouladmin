import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Sidebar() {
  const user = useSelector((state) => state.auth.user);




  return (
    <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 " id="sidenav-main">
      <div className="sidenav-header">
        <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
        <a className="navbar-brand m-0" href=" https://demos.creative-tim.com/soft-ui-dashboard/pages/dashboard.html " target="_blank">
          <img src="../assets/img/bionic_soul_logo-removebg-preview.png" className="navbar-brand-img h-100" alt="main_logo" />
          <span className="ms-1 font-weight-bold">Bionic Soul</span>
        </a>
      </div>
      <hr className="horizontal dark mt-5" />
      <div className="collapse navbar-collapse w-auto " id="sidenav-collapse-main">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/dashboard/product" className="nav-link ">
              <span className="nav-link-text ms-1">Dashboard</span>
            </Link>
          </li>  
          {user?.isSuperAdmin ? 
            <li className="nav-item">
              <Link to="/dashboard/user" className="nav-link ">
                <span className="nav-link-text ms-1">Users</span>
              </Link>
            </li> 
            : <></>
          }

          <li className="nav-item"  >
            <Link to="/dashboard/product" className="nav-link ">
              <span className="nav-link-text ms-1">Products</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/partner" className="nav-link ">
              <span className="nav-link-text ms-1">Partners</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/award" className="nav-link ">
              <span className="nav-link-text ms-1">Awards</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/contact" className="nav-link ">
              <span className="nav-link-text ms-1">Contacts</span>
            </Link>
          </li>
          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Account pages</h6>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/" className="nav-link ">
              <span className="nav-link-text ms-1">Profile</span>
            </Link>
          </li>
           <li className="nav-item">
            <Link to="/login" className="nav-link ">
              <span className="nav-link-text ms-1">Settings</span>
            </Link>
          </li>
          {/*<li className="nav-item">
            <Link to="/register" className="nav-link ">
              <span className="nav-link-text ms-1">Sign Up</span>
            </Link>
          </li> */}
        </ul>
      </div>
      <div className="sidenav-footer mx-3 ">
        <div className="full-background" style={{ backgroundImage: `url('../assets/img/curved-images/white-curved.jpg')` }}></div>
        <div className="card-body text-start p-3 w-100">
          <div className="docs-info">
            <p className="text-xs font-weight-bold">Please check our docs</p>
            <Link to="/dashboard/" href="https://www.creative-tim.com/learning-lab/bootstrap/license/soft-ui-dashboard" className="btn btn-sm w-100 mb-0">Tips</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
