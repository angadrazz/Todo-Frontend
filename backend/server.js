const express = require("express");
const app = express();
const cors = require("cors");
const {MongoClient, ObjectId} = require("mongodb");

const PORT = 5000;

let db;

let connectionString = "mongodb://localhost:27017/crud";

app.use(cors());
app.use(express.json());

const todoRoutes = express.Router();

todoRoutes.route("/").get(function(req, res){
    db.collection("todos")
    .find()
    .toArray(function(err, items){
        res.send(items);
    })
})

todoRoutes.route("/:id").get(function(req, res){
    let id = new ObjectId(req.params.id);
    db.collection("todos")
    .find({ _id: id})
    .toArray(function(err, items){
        res.send(items);
    })
})

todoRoutes.route("/add").post(function(req, res){
    db.collection("todos").insertOne(req.body, function(err, info){
        res.json(info);
    })
})

todoRoutes.route("/update/:id").put(function(req, res){
    db.collection("todos").findOneAndUpdate(
        {_id: new ObjectId(req.params.id)},
        {
            $set:{
                                todo_description: req.body.todo_description,
				todo_responsible: req.body.todo_responsible,
				todo_priority: req.body.todo_priority,
				todo_complete: req.body.todo_complete,
            }
        },
        function(){
            res.send("Updated")
        }
    )
})

todoRoutes.route("/delete/:id").delete(function(req, res){
    db.collection("todos").deletOne(
        {_id: new ObjectId(req.params.id)},
        function(){
            res.send("Deleted")
        }
    )
})


app.use("/todos", todoRoutes)


MongoClient.connect(
    connectionString,
    {useNewUrlParser: true},
    (error, client)=>{
        if(error){
            return console.log("Connection Failed");
        }
        console.log("Connection Established");
        db = client.db("crud");
        app.listen(PORT, function(){
            console.log("Running on port: "+PORT)
        })
    }
)