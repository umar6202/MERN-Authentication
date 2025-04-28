const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = "qwertyuiopasdfghjklzxcvbnmqwerty";

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not Valid Email")
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

//password hashing
userSchema.pre("save", async function(next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next()
});

//token generate
userSchema.methods.generateAuthtoken = async function() {
    try {
        let tokenA = jwt.sign({ _id: this._id }, secretKey,{
            expiresIn: "1d"
        });

        this.tokens = this.tokens.concat({token: tokenA });
        await this.save();
        return tokenA;

    } catch (error) {
        res.status(422).json(error);        
    }
    
}
// Creating model
const userdb = new mongoose.model("user",userSchema);

module.exports = userdb;