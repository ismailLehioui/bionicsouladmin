import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/apiCalls/authApiCall';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    if (error) {
      setErrorMessage(error);
    }
  }, [user, error, navigate]);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div>
      <div className="container position-sticky z-index-sticky top-0">
        <div className="row">
          <div className="col-12"></div>
        </div>
      </div>
      <main className="main-content mt-0">
        <section>
          <div className="page-header min-vh-75">
            <div className="container">
              <div className="row">
                <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                  <div className="card card-plain mt-8">
                    <div className="card-header pb-0 text-left bg-transparent">
                      <h3 className="font-weight-bolder text-info text-gradient">Welcome back</h3>
                      <p className="mb-0">Enter your email and password to sign in</p>
                    </div>
                    <div className="card-body">
                      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                      <form onSubmit={formSubmitHandler}>
                        <label>Email</label>
                        <div className="mb-3">
                          <input
                            value={email}
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            aria-label="Email"
                            aria-describedby="email-addon"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <label>Password</label>
                        <div className="mb-3">
                          <input
                            value={password}
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="password-addon"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="rememberMe" />
                          <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn bg-gradient-info w-100 mt-4 mb-0">Sign in</button>
                        </div>
                      </form>
                    </div>
                    <div className="card-footer text-center pt-0 px-lg-2 px-1">
                      <p className="mb-4 text-sm mx-auto">
                        Don't have an account?
                        <Link to="/register" className="text-info text-gradient font-weight-bold">Sign up</Link>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                    <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6" style={{ backgroundImage: `url('./assets/img/curved-images/curved6.jpg')` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
