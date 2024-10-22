const express=require("express");
const app=express();
const PORT=8080;
const path=require("path");
const filepath=path.join(__dirname,"./views/index.ejs");
app.set('view engine', 'ejs');
// app.get("/",(req,res)=>{
//     let name="Sam";
//     let place="Bengaluru"
//     res.render(filepath,{name,destination:place});
// })
app.get("/welcome", (req, res) => {
    let username = req.query.username || 'sam';  
    let currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12) {
        greeting = "Good Morning";
    } else {
        greeting = "Good Evening";
    }
    res.render(filepath, { username, greeting });
});

app.listen(PORT,(err)=>{
    if(err){
        console.log(err);
    } 
    else{
        console.log(`Listening on PORT ${PORT}`);
    }
})