

const Register = () => {


    return (
        <div className="background">
            <div className="column align-center w-25 margin m-t-150 p-20 background-white">
                <h1>Register</h1>
                <input type="text" placeholder="First Name" className="m-t-20 p-10 input "/>
                <input type="text" placeholder="Last Name" className="m-t-20 p-10 border"/>
                <input type="email" placeholder="Email" className="m-t-20 p-10 border"/>
                <input type="username" placeholder="Username" className="m-t-20 p-10 border"/> 
                <input type="password" placeholder="Password" className="m-t-20 p-10 border"/>
                <input type="password" placeholder="Confirm Password" className="m-t-20 p-10 border"/>

                <button className="m-t-20 p-10 border button">REGISTER</button>
                <button className="m-t-20 p-10 button-white">RETURNE TO LOGIN</button>
                <p className="m-t-20 p">©2025 ICT Cortex. All rights reserved</p>
            </div>
        </div>
    )

}

export default Register;