/**************************************************************
 *
 * main.js
 * Website for the upcoming Lee Jennings EP
 *
 **************************************************************/


const express = require("express")
const path = require("path")
const sass = require("node-sass-middleware")


const app = express()
const port = process.env.PORT || "8003";


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
    console.log(`Lee Jennigns EP`);
    console.log(`Listetning on port ${port}`);
});
