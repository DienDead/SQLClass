const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const{ v4:uuidv4} = require("uuid");
const path = require("path");
const port = 8080;
const methodOverride = require("method-override");


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/view"));

//fakerjs for creating fake data
// let createRandomUser = () => {
//     return [
//         faker.string.uuid(),
//         faker.internet.username(),
//         faker.internet.email(),
//         faker.internet.password()
//     ];
// };

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ket@15422',
    database: 'deltaApp',
});

//home page user count
app.get('/', (req, res) => {
    let query = "select count(*) from user";
    connection.query(query, (err, results) => {
        if (err) console.log(err);
        else {
            let userCount = results[0]["count(*)"];
            res.render("home.ejs", { userCount });
        }
    });
});

// new user form
app.get('/user/newUser',(req,res)=>{
    res.render("newUser.ejs");
});

//new user route
app.post('/user',(req,res)=>{
    let user = req.body;
    let q=`insert into user (id,username,email,password) values (?,?,?,?)`;
    let id=uuidv4();
    let values = [id,user.username,user.email,user.password];
    connection.query(q,values,(err,result)=>{
        if(err) console.log(err);
        else{
            res.redirect('/');
        }
    });
})

// Show all users route
app.get('/user', (req, res) => {
    let query = "select * from user";
    connection.query(query, (err, users) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error in Database");
        }
        else {
            res.render("user.ejs", { users });
        }
    });
});

//Edit route
app.get('/user/:id/edit', (req, res) => {
    let { id } = req.params;
    let query = `select * from user where id='${id}'`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error in Database");
        }
        else {
            let user = result[0];
            res.render("edit.ejs", { user });
        }
    });
});

// patch route
app.patch('/user/:id', (req, res) => {
    let { id } = req.params;
    let{password: formPass,username: newUserName} = req.body;

    let query = `select * from user where id='${id}'`;

    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error in Database");
        }
        else {
            let user = result[0];
            if(formPass != user.password){
                res.status(401).send("Password is incorrect");
            }
            else{
                let updateQuery = `update user set username='${newUserName}' where id='${id}'`;
                connection.query(updateQuery, (err, result) =>{
                    if(err){
                        console.log(err);
                        res.status(500).send("Error in Database");
                    }
                    else{
                        console.log(result);
                        res.redirect('/user');
                    }
                })
            }
        }
    });
});

//delete Form
app.get('/user/:id/delete', (req, res) => {
    let { id } = req.params;
    let query = `select * from user where id='${id}'`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error in Database");
        }
        else {
            let user = result[0];
            res.render("delete.ejs", { user });
        }
    });
});

// delete route
app.delete("/user/:id",(req,res)=>{
    let { id } = req.params;
    let query = `select * from user where id = '${id}'`;

    let{password:formPass ,email:formEmail } = req.body;
    console.log(formEmail);
    console.log(formPass);

    connection.query(query, (err, result) =>{
        if(err){
            console.log(err);
            res.status(500).send("Error in Database");
        }
        else{
            let user = result[0];
            if(formPass != user.password || formEmail != user.email){
                res.status(401).send("Incorrect Email or Password");
            }
            else{
                let deleteQuery = `delete from user where id = '${id}'`;
                connection.query(deleteQuery,(err,result)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send("Error in Database");
                    }
                    else{
                        res.redirect('/user');
                    }
                })
            }
        }
    });
});

app.listen("8080", () => {
    console.log("Server is running on port 8080");
});

// connection.end();