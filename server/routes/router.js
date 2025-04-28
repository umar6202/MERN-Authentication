const express = require('express');
const router = new express.Router();
const userdb = require('../models/userSchema');
var bcrypt = require("bcryptjs");
const authenticate = require('../middleware/authenticate');

// For User Registration
router.post('/register', async(req, res) =>{
    //console.log(req.body);
    const {fname, email, password, cpassword} = req.body;
    if(!fname || !email || !password || !cpassword){
        res.status(422).json({error:"Fill all the details"});
    }

    try{
        const preuser = await userdb.findOne({email:email});
        if (preuser){
            res.status(422).json({error:"Email already exists"});
        }else if(password !== cpassword){
            res.status(422).json({error:"Password and Confirm Password should be same"});
        }else{
            const finaluser = new userdb({
                fname, email, password, cpassword
            });

            //password hashing
            const storeData = await finaluser.save();
            //console.log(storeData);
           /* res.status(201).json({ message: "Registration successful (for now)" });*/
            res.status(201).json({status:201, storeData});
        }

    } catch(error){
        res.status(422).json(error);
        console.log("catch block error");
    }
    
});

// For User Login

router.post('/login', async(req, res) =>{
   // console.log(req.body);
    const {email, password} = req.body;
    if(!email || !password ){
        res.status(422).json({error:"Fill all the details"});
    }

    try{
        const ValidUser = await userdb.findOne({email:email});
        if (ValidUser){
            const match = await bcrypt.compare(password, ValidUser.password);

            if (!match){
                res.status(422).json({error:"Invalid Credentials"});
            }else {
                //token generate
                const token = await ValidUser.generateAuthtoken();
               // console.log(token);  

                // cookiegenerate
                res.cookie("usercookie",token,{
                    expires:new Date(Date.now()+9000000),
                    httpOnly:true
                });

                const result = {
                    ValidUser,
                    token
                }
                res.status(201).json({status:201,result})
            }
        }
    } catch(error){
        res.status(402).json(error);
        console.log("catch block error");
    }
});


// For User Validation

router.get('/validUser', authenticate,async(req, res) =>{
    //console.log("done");
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        res.status(201).json({status:201, ValidUserOne});

    } catch (error) {
        res.status(401).json({status:401, error});        
    }
     
 });

 // user logout

router.get("/logout",authenticate,async(req,res)=>{
    try {
        req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie",{path:"/"});

        req.rootUser.save();

        res.status(201).json({status:201})

    } catch (error) {
        res.status(401).json({status:401,error})
    }
})

module.exports = router;