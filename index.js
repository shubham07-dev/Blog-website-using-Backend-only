const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

const path = require("path");

const { v4: uuidv4 } = require("uuid");

const methodOverride = require("method-override");

const multer = require("multer");
const upload = multer({ dest: "uploads" });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
  { id: uuidv4(), username: "shubham shukla", content: "Welcome To My Blog Web-Site " },
  { id: uuidv4(), username: "aman", content: "This is my Blog." },
  { id: uuidv4(), username: "aniket", content: "Coding, also known as computer programming, is the process of writing instructions that tell a computer what to do. These instructions are written in a programming language, which is a set of rules and symbols that computers understand. It's the foundation of software, applications, websites, and various other digital tools. " },
];

app.get('/', (req, res) => {
  res.redirect('/post');
});


app.get("/post", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/post/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/post", (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  posts.push({ id, username, content });
  res.redirect("/post");
});

app.get("/post/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("show.ejs", { post });
});

app.patch("/post/:id", upload.single("image"), (req, res) => {
  let { id } = req.params;
  let newcontent = req.body.content;
  let post = posts.find((p) => id === p.id);
  post.content = newcontent;

  if (req.file) {
    post.imagePath = `/uploads/${req.file.filename}`;
  }

  res.redirect("/post");
});

app.get("/post/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("edit.ejs", { post });
});

app.delete("/post/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => id !== p.id);
  res.redirect("/post/");
});


