import React from 'react'

function Footer() {
    return (

        <footer className="footer pt-3  ">
            <div className="container-fluid">
                <div className="row align-items-center justify-content-lg-between">
                    <div className="col-lg-6">
                        <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                            <li className="nav-item">
                                <a href="https://www.creative-tim.com" className="nav-link text-muted" >Creative Tim</a>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.creative-tim.com/presentation" className="nav-link text-muted" >About
                                    Us</a>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.creative-tim.com/blog" className="nav-link text-muted" >Blog</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer