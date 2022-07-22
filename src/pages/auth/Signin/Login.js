import React from 'react'

function Login() {
    return (
        <div>
            <div className="hero_area">
                <header className="header_section">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg justify-content-lg-between custom_nav-container ">
                            <a className="navbar-brand" href="index.html">
                                <img src="SHIP/images/PTT2.png" alt />
                                <span>
                                    SHIP.CMD
                                </span>
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon" />
                            </button>
                            <div className="collapse navbar-collapse " id="navbarSupportedContent">
                                <div className="d-flex mx-auto flex-column  flex-lg-row align-items-center ">
                                    <ul className="navbar-nav  ">
                                        <li className="nav-item active">
                                            <a className="nav-link" href="index.html">Home <span className="sr-only">(current)</span></a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="about.html">About CMD</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="contact.html">Contact us</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>
            </div>
            <section className=" slider_section position-relative">
                <div className="slider_bg-container"> </div>
                <div className="slider-container">
                    <div className="slider_bg-Transparent"> </div>
                    <div className="detail-box">
                        <form className="login">
                            <img src="SHIP/images/logo_PTT.png" alt width={260} height={115} />
                            <p className="font_fontcolor">
                                Sign in
                            </p>
                            <input type="text" placeholder="Username" />
                            <input type="password" placeholder="Password" />
                            <label>
                                <input type="checkbox" defaultChecked="checked" name="remember" /> Remember me
                            </label>
                            <button>Login</button>
                        </form></div>
                    <div className="img-box">
                        <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img src="SHIP/images/work1.jpg" alt />
                                </div>
                                <div className="carousel-item">
                                    <img src="SHIP/images/work2.jpg" alt />
                                </div>
                                <div className="carousel-item">
                                    <img src="SHIP/images/work3.jpg" alt />
                                </div>
                                <div className="carousel-item">
                                    <img src="SHIP/images/work4.jpg" alt />
                                </div>
                                <div className="carousel-item">
                                    <img src="SHIP/images/work5.jpg" alt />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="container-fluid footer_section position-fixed">
                <footer className="outer">
                    <div className="inner">
                        <img src="SHIP/images/logo-ptt.svg" alt width={122} height={35} />
                        บริษัท ปตท. จำกัด (มหาชน)
                    </div>
                    <div className="inner">555 ถนนวิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900</div>
                </footer>
            </section>
        </div>

    )
}

export default Login