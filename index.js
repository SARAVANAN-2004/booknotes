import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import ejs from 'ejs';

const app = express();
const port = 3000;

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"books",
    password:"saravanan@28",
    port:5432
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let items = [];
let book = {};

async function getItems(basedOn) {
    const res = await db.query("Select * from items order by $1",[basedOn]);
    // console.log(res.rows);
    items = res.rows;
}

async function getbook(id) {
    const res = await db.query("select * from items where id = $1",[id]);
    console.log(res.rows);
    book = res.rows[0];
    book.my_notes = book.my_notes ? book.my_notes.split('\n') : [];
}

app.get("/", async (req,res)=>{
    await getItems("recomendation");
    res.render("index.ejs",{items:items});
})

app.post("/details",async (req,res)=>{
    await getbook(req.body.id);
    console.log(book);
    res.render("details.ejs",{book:book});
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });