import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import ejs from 'ejs';
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;


const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});


db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let items = [];
let book = {};

async function getItems() {
    const res = await db.query("select * from items order by recomendation desc;");
    // console.log(res.rows);
    items = res.rows;
}

async function getbook(id) {
    const res = await db.query("select * from items where id = $1",[id]);
    console.log(res.rows);
    book = res.rows[0];
    book.my_notes = book.my_notes ? book.my_notes.split('\n') : [];
}

async function sortItem(criteria) {
    console.log(criteria);
    if (criteria === "title") {
        const res = await db.query("select * from items order by title ;");
        // console.log(res.rows);
        items = res.rows;
    }else if(criteria === "recomendation"){
        const res = await db.query("Select * from items order by recomendation desc");
        // console.log(res.rows);
        items = res.rows;
    }else{
        const res = await db.query("Select * from items order by date desc");
        // console.log(res.rows);
        items = res.rows;
    }
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

app.get("/sort",async (req,res)=>{
    await sortItem(req.query.criteria);
    // console.log(req.query.criteria);
    // console.log(items);
    res.render("index.ejs",{items:items});
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });