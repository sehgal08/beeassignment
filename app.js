const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const PORT = 8080;
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static('public/uploads'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

let tasks = [];
let products = [
    {"id": 1, "name": "TV", "price": 45000},
    {"id": 2, "name": "Iphone", "price": 78000},
    {"id": 3, "name": "AC", "price": 32000},
    {"id": 4, "name": "Monitor", "price": 24440},
    {"id": 5, "name": "Ipad", "price": 68000},
];
let users = [
    {"name": "Sam", "age": 23, "hobby": "Coin collecting"},
    {"name": "John", "age": 27, "hobby": "Knives"},
    {"name": "Winston", "age": 53, "hobby": "Guns"},
    {"name": "Barney", "age": 42, "hobby": "Wine"},
    {"name": "Luke", "age": 77, "hobby": "Stamp collecting"},
];
let searchList = [
    {"name": "books", "items": ["Crime and Punishment", "The Setting Sun", "The Interview", "The Silent Patient", "The Picture of Dorian Gray"]},
    {"name": "movies", "items": ["Fast and the Furious", "Shutter Island", "Inception", "The Dark Knight", "The Dictator"]},
    {"name": "tv", "items": ["House of Cards", "White Collar", "Prison Break", "Breaking Bad", "Lucifer"]},
];
let catalog = [
    {"name": "TV", "description": "It is a 4K OLED TV. It is priced at 449,979.", "image": "in-oled-s90c-458654-qa77s90caklxl-536865425.avif"},
    {"name": "GalaxyBook 4 Pro", "description": "Samsung's latest laptop with cutting edge technology. It is priced at 140000", "image" : "download.jpeg"}
]
let posts = [];
let contacts = [];

function time(){
    const hour = new Date().getHours();
    if(hour < 12) return "Good Morning";
    else if(hour < 15) return "Good Afternoon";
    else if(hour < 20) return "Good Evening";
    else return "Good Night";
}

app.get("/welcome", (req, res) => {
    let name = "John";
    let good = time();
    res.render('welcome', {name, good});
});

app.post("/add-task", (req, res) => {
    const newTask = req.body.task;
    if(newTask) tasks.push(newTask);
    res.redirect("/todo");
});

app.post("/delete-task/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    if(!isNaN(taskId) && taskId >= 0 && taskId < tasks.length){
        tasks.splice(taskId, 1);
    }
    res.redirect("/todo");
});

app.get("/todo", (req, res) => {
    res.render('todo', {tasks});
});

app.get("/products", (req, res) => {
    const searchQuery = req.query.search;
    let productSearch = products;
    if(searchQuery){
        productSearch = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    res.render('products', {products: productSearch});
});

app.get("/profile/:username", (req, res) => {
    const username = req.params.username;
    const user = users.find(u => u.name.toLowerCase() === username.toLowerCase());
    if(user) res.render('profile', {user});
    else res.status(404).send("User not found");
});

app.get("/search", (req, res) =>{
    const searchQuery = req.query.q;
    let searchRes = [];
    if(searchQuery){
        searchRes = searchList.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    res.render('search', {searchQuery, searchRes});
});

app.get("/posts", (req, res) => {
    res.render('posts', {posts});
});

app.post("/posts", (req, res) => {
    const {title, body} = req.body;
    if(title && body) posts.push({title, body});
    res.redirect("/posts");
});

app.get("/posts/:title", (req, res) => {
    const title = req.params.title;
    const post = posts.find(p => p.title === title);
    if(post) res.render('postDetail', {post});
    else res.status(404).send("Post not found");
});

app.get("/contact", (req, res) => {
    res.render('contact', {errors: [], formData: {}, submitted: false});
});

app.post("/contact", (req, res) => {
    const {name, email, message} = req.body;
    let errors = [];

    if(!name) errors.push("Name is required");
    if(!email) errors.push("Email is required");
    if(!message) errors.push("Message is required");
    if(errors.length > 0) res.render('contact', { errors, formData: { name, email, message }, submitted: false });
    else{
        contacts.push({ name, email, message });
        res.render('contact', { errors: [], formData: { name, email, message }, submitted: true });
    }
});

app.get("/catalog", (req, res) => {
    res.render('catalog', {catalog});
});

app.post("/catalog", upload.single('image'), (req, res) => {
    const {name, description} = req.body;
    const image = req.file ? req.file.filename : null;
    if (name && description && image) catalog.push({name, description, image});
    res.redirect("/catalog");
});

app.listen(PORT, (err) => {
    if(err) console.log(err);
    else console.log(`Listening to Port ${PORT}`);
});