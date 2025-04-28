import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./mix.css"

const Register = () => {

    const [PassShow, setPassHide] = useState(false);
    const [cPassShow, setcPassHide] = useState(false);

    const [InputValue, setInputValue] = useState({
        fname: "",
        email: "",
        password: "",
        cpassword: ""
    });

    console.log(InputValue);

    const setValue = (e) => {
        //console.log(e.target.value);
        const { name, value } = e.target;

        setInputValue(() => {
            return {
                ...InputValue,
                [name]: value
            }
        });
    };

    const addUserData = async (e) => {
        e.preventDefault();

        const { fname, email, password, cpassword } = InputValue;

        if (fname === "") {
            //alert("Enter Your Name");
            toast.warning("fname is required!", {
                position: "top-center"
            });
        } else if (email === "") {
            //alert("Enter Your Email");
            toast.error("email is required!", {
                position: "top-center"
            });
        } else if (!email.includes("@")) {
            //alert("Invalid Email");
            toast.warning("includes @ in your email!", {
                position: "top-center"
            });
        } else if (password === "") {
            //alert("Enter Your Password");
            toast.error("password is required!", {
                position: "top-center"
            });
        } else if (cpassword === "") {
            //alert("Enter Your CPassword");
            toast.error("cpassword is required!", {
                position: "top-center"
            });
        } else if (password !== cpassword) {
            //alert("Password and cpassword are not same");
            toast.error("pass and Cpass are not matching!", {
                position: "top-center"
            });
        } else {
            //console.log("User Registration Sucessful");

            const data = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fname, email, password, cpassword
                })
            });

            const res = await data.json();
            //console.log(res.status);

            if (res.status === 201) {
                //alert("User Registration Sucessful");
                toast.success("Registration Successfully done 😃!", {
                    position: "top-center"
                });
                setInputValue({ ...InputValue, fname: "", email: "", password: "", cpassword: "" });
            }
        }
    }

    return (
        <>
            <section>
                <div className="form_data">

                    <div className="form_heading">
                        <h1>SIGN UP</h1>
                        <p style={{ textAlign: "center" }}>We are glad that you will be using Project Cloud to manage <br />
                            your tasks! We hope that you will get like it.</p>
                    </div>

                    <form>
                        <div className="form_input">
                            <label htmlFor="fname">Name:</label>
                            <input type="text" onChange={setValue} id="fname" value={InputValue.fname} name="fname" placeholder='Enter Your Name' required />
                        </div>

                        <div className="form_input">
                            <label htmlFor="email">E-mail:</label>
                            <input type="email" onChange={setValue} id="email" value={InputValue.email} name="email" placeholder='Enter Your Email Address' required />
                        </div>

                        <div className="form_input">
                            <label htmlFor="password">Password:</label>
                            <div className="two">
                                <input type={!cPassShow ? "text" : "password"} onChange={setValue} id="password" value={InputValue.password} name="password" placeholder='Enter Your Password' required />
                                <div className="showpass" onClick={() => setcPassHide(!cPassShow)}>
                                    {!cPassShow ? "Hide" : "Show"}
                                </div>
                            </div>
                        </div>

                        <div className="form_input">
                            <label htmlFor="password">Confirm Password:</label>
                            <div className="two">
                                <input type={!PassShow ? "text" : "password"} onChange={setValue} id="cpassword" value={InputValue.cpassword} name="cpassword" placeholder='Confirm Password' required />
                                <div className="showpass" onClick={() => setPassHide(!PassShow)}>
                                    {!PassShow ? "Hide" : "Show"}
                                </div>
                            </div>
                        </div>

                        <button type="submit" onClick={addUserData} className="btn">Sign Up</button>
                        <p> Already have Account? <NavLink to="/"> Sign In</NavLink> </p>
                    </form>
                    <ToastContainer />

                </div>
            </section >

        </>
    )
}

export default Register;