import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "./mix.css"

const Login = () => {

    const [PassShow, setPassHide] = useState(false);

    const [InputValue, setInputValue] = useState({
            email:"",
            password:""
    });
    //console.log(InputValue);

    const history = useNavigate();

    const setVal = (e) => {
        //console.log(e.target.value);
        const {name, value} = e.target;
         
        setInputValue(() =>{
            return{
                ...InputValue, 
                [name]: value
            }
        });
    };

    const cUserLogin = async (e) =>{
        e.preventDefault();
        
        const {email, password} = InputValue;
        
        if(email === ""){
            //alert("Enter Your Email");
            toast.error("email is required!", {
                position: "top-center"
            });
        }else if (!email.includes("@")){
            toast.warning("includes @ in your email!", {
                position: "top-center"
            });
            //alert("Invalid Email");
        }else if (password === ""){
            //alert("Enter Your Password");
            toast.error("password is required!", {
                position: "top-center"
            });
        }else{
           // console.log("User Login Sucessful");

            const data = await fetch("/login",{
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email, password
                })
            });

            const res = await data.json();
            //console.log(res);

            if (res.status === 201){
                //alert("User Login Sucessful");
                localStorage.setItem("UserDataToken", res.result.token);
                history("/dashboard")
                setInputValue({...InputValue, email:"", password:""});
            }
        }
    };

    return (
        <>
            <section>
                <div className="form_data">

                    <div className="form_heading">
                        <h1>Welcome Back! Login</h1>
                        <p>Hi, we are glad you are back. Please Login.</p>
                    </div>

                    <form>
                        <div className="form_input">
                            <label htmlFor="email">E-mail:</label>
                            <input type="email" id="email" name="email" onChange={setVal} value={InputValue.email} placeholder='Enter Your Email Address' required />
                        </div>

                        <div className="form_input">
                            <label htmlFor="password">Password:</label>
                            <div className="two">
                                <input type={!PassShow ? "text" : "password"} id="password" name="password" onChange={setVal} value={InputValue.password} placeholder='Enter Your Password' required />
                                <div className="showpass" onClick={() => setPassHide(!PassShow)}>
                                    {!PassShow ? "Hide" : "Show"}
                                </div>
                            </div>
                        </div>

                        <button type="submit" onClick={cUserLogin} className="btn"> Sign In </button>
                        <p> Don't have Account? <NavLink to="/register"> SignUp</NavLink> </p>
                    </form>
                    <ToastContainer />
                </div>
            </section>
        </>
    )
}

export default Login;