import React from 'react'
import "../App.css"
import { Link } from 'react-router-dom'
function Landing() {
    return (
        <div className='landingPageContainer'>
             <nav>
                <div className='navHeader'>
                    <h2>ZYNKUP</h2>
                </div>
                <div className='navlist'>
                    <p>Join as Guest</p>
                    <p>Register</p>
                    <div role='button'>
                    <p>Login</p>
                    </div>
                </div>
            </nav>


            <div className='landingMainContainer'>
                <div>
                    <h1><span style={{color:"#ff9839"}}>Connect</span> With Your Loved Once</h1>
                    <p>cover a distance with ZYNKUP</p>
                    <div role='button'>
                    <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>
                    <img src='/public/assets/mobile.png'/>
                </div>
            </div>
        </div>
           
    )
}

export default Landing
