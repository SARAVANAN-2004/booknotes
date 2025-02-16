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

async function getItems(basedOn) {
    const res = await db.query("Select * from items order by $1",[basedOn]);
    console.log(res.rows);
    items = res.rows;
}

app.get("/", async (req,res)=>{
    await getItems("recomendation");
    res.render("index.ejs",{items:items});
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });