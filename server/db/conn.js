const mongoose = require('mongoose');

const db = "mongodb+srv://umarali6202:umarali123@cluster0.o611jdg.mongodb.net/AuthUser?retryWrites=true&w=majority&appName=Cluster0"  

mongoose.connect(db, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("DB Connected")).catch((errr)=>{
    console.log(errr);
})