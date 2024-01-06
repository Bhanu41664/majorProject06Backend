const express=require("express");
const mysql=require("mysql")
const bodyParser = require('body-parser');
const cors=require("cors")
const app=express()
const mongoose = require("mongoose");
app.use(bodyParser.json());
const AdminQuestions =require("./models/Admin")
const adminRoute =require("./rootes/Admin");
//mongo db database connection

mongoose
  .connect("mongodb://0.0.0.0:27017/QUERIES")
  .then(console.log("connectd sunccesfu lly"))
  .catch((err) => console.log(err));
app.use(express.json());
app.use(cors());

//sql database connections
let activeDatabase="sailor"
const db1=mysql.createConnection({
    host :"localhost",
    user: "root",
    password:"Amma41664@",
    database:activeDatabase

})
app.get('/',(re,res)=>{
    return res.json("FROM BACKEND SIDE");
})
app.post('/api/sendData', (req, res) => {
    const { value,correctanswer,database } = req.body;
    console.log(value);
    console.log(correctanswer);
    console.log(database);
    activeDatabase=database;
    console.log('Received data from frontend:', value);
  //changing database on clicking

  const db1 = mysql.createConnection({
    host :"localhost",
    user: "root",
    password:"Amma41664@",
    database:activeDatabase
  });
  
  db1.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to new database');
    }
  });

  //ending changing of the database
  //comparing two strings
    const sql2=correctanswer;
    const sql3=value;
    console.log(sql3);
    db1.query(sql2,(err,data1)=>{
    if(err) return(res.json(err.message));
    else 
     db1.query(sql3,(err,data2)=>{
    if(err)return(res.json({success : err.message}));
    else{
       console.log(data2)
        try{
            
            if(JSON.stringify(data1) ===JSON.stringify(data2))
            {
                console.log('true');
                res.status(200).json({ success: "correct answer", message: 'Data received successfully', output: data2 });
            }
            else{
                
                res.json({ success: "wrong answer", message: 'Data received successfully', output: data2 });
                console.log('false');
            }
           
        }
        catch(err)
        {
            console.log('true');
           
        }
      
    }
    })
})

});
//showing all the tables from the database
app.get('/tables/', (req, res) => {

//changing database 





//ending database




    const queryTables = 'SHOW TABLES';
    console.log("database name is"+db1.config.database)
    db1.query(queryTables, (err, resultsTables) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log("bhanupakash")
        const tables = resultsTables.map((row) => row[`Tables_in_${db1.config.database}`]);
        // console.log("show databases"+db1.config.database);
        console.log("the database is"+ activeDatabase)
  
        const dataPromises = tables.map((table) => {
          return new Promise((resolve, reject) => {
            const queryData = `SELECT * FROM ${table}`;
            db1.query(queryData, (err, resultsData) => {
              if (err) {
                reject(err);
              } else {
                resolve({ tableName: table, data: resultsData });
              }
            });
          });
        });
  
        Promise.all(dataPromises)
          .then((tableData) => {
            console.log("bhanuprakash",tableData);
            res.json({ tables, tableData });
          })
          .catch((error) => {
            res.status(500).json({ error: error.message });
          });
      }
    });
  });
  

//showing database
app.get('/database', (req, res) => {
    const queryTables = 'SHOW databases';
    db1.query(sql2,(err,databasedata)=>{

    })

})

//adding new admin

app.get("/api/admin/:id", async (req, res) => {
  try {
    const post = await AdminQuestions.findById(req.params.id);
    console.log(post.database);

    const newDatabase = post.database;
    //creating connection
    const activeDatabase=newDatabase;
    const db1 = mysql.createConnection({
      host :"localhost",
      user: "root",
      password:"Amma41664@",
      database:activeDatabase
    });
    
    db1.connect((err) => {
      if (err) {
        console.error('Error connecting to database:', err);
      } else {
        console.log('Connected to new database');
      }
    });
    console.log(post.database);
  
    //ending connection

    res.status(200).json(post);
  } catch (err) {
    return res.status(404).json("question is not found");
  }
});

//ending showing of the database
app.use("/api/admin",adminRoute);
app.listen(3000,()=>{
    console.log("listening ");
})