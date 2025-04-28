import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Dashboard = () => {

  const { logindata, setLoginData } = useContext(LoginContext);
  const [data, setData] = useState(false);

  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("UserDataToken");
    //console.log(token);
    const res = await fetch("/validUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });

    const data = await res.json();
    //console.log(data);

    if (data.status === 401 || !data) {
      //console.log("User data Invalid Redirect");
      history("*");
    } else {
      console.log("User Verify");
      setLoginData(data)
      history("/dashboard");
    }
  }

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true)
    }, 2000)

  }, [])

  return (
    <>
      {
        data ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="./man.png" style={{ width: "200px", marginTop: 20 }} alt="" />
          <h1>User Email:{logindata ? logindata.ValidUserOne.email : ""}</h1>
        </div> : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      }

    </>
  )
}

export default Dashboard

/*{logindata ? logindata.ValidUserOne.email : ""}*/