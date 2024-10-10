const { app } = require("..");
const { connectDB } = require("../db/connectDB");

const PORT = process.env.PORT || 4000;

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Application is running on port ${PORT}`);
    })
}).catch(()=>{
    console.error("Failed to connect to MongoDB");
    process.exit(1);
})