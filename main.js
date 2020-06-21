/**************************************************************
 * main.js
 **************************************************************/


const express = require("express")
const path = require("path")
const sass = require("node-sass-middleware")


const app = express()
const port = process.env.PORT || "8004";


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


app.use(
    sass({
        src: path.join(__dirname, "sass"),
        dest: path.join(__dirname, "public"),
    })
);
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (request, response) => {
    response.render("index");
});

app.listen(port, () => {
    console.log(`Festi Lineup Creator`);
    console.log(`Listetning on port ${port}`);
});
