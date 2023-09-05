const express = require("express")
const mysql = require("mysql")
const app=express()

// Serve static files from the "public" directory
app.use(express.static("public"));

const con = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'mun'
})

con.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("connected")
    }
})


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


app.get("/fetch", (req, res) => {
    con.query("SELECT * FROM `members`;", function(err, result, fields){
        if (err){
            console.log(err);
            res.status(500).json({ error: "An error occurred" });
        } else {
            // Send the fetched data as JSON
            res.json(result);
            console.log(result)
            
        }
    });
});

// Handle the POST request to add a name to the database with "xp" and "id" as variables
app.post("/addName", express.json(), (req, res) => {
    const { fn, ln, xp } = req.body;
    
    // Function to generate a random 3-digit ID
    const generateRandomId = () => {
        return Math.floor(100 + Math.random() * 900); // Random number between 100 and 999
    };

    // Function to insert the data into the database
    const insertData = (id) => {
        const insertSql = "INSERT INTO members VALUES (?, ?, ?, ?)";
        con.query(insertSql, [id, fn ,ln, xp], (insertErr, insertResult) => {
            if (insertErr) {
                console.error("Error adding name:", insertErr);
                res.status(500).json({ error: "An error occurred" });
            } else {
                console.log("Name added to the database.");
                res.json({ message: "Name added successfully" });
            }
        });
    };


    // Check if the ID already exists in the database
    const checkId = (id) => {
        const checkSql = "SELECT * FROM members WHERE id = ?";
        con.query(checkSql, [id], (checkErr, checkResult) => {
            if (checkErr) {
                console.error("Error checking for ID:", checkErr);
                res.status(500).json({ error: "An error occurred" });
            } else {
                if (checkResult.length > 0) {
                    // ID already exists, generate a new one and check again
                    const newId = generateRandomId();
                    checkId(newId);
                } else {
                    // ID does not exist, proceed with the insert
                    insertData(id);
                }
            }
        });
    };

    // Generate a random 3-digit ID initially and check if it exists
    const initialId = generateRandomId();
    checkId(initialId);
});



app.post("/deletePerson", express.json(), (req, res) => {
    const { id } = req.body;

    // Function to delete the person from the database
    const deleteData = (id) => {
        const deleteSql = "DELETE FROM members WHERE id = ?";
        con.query(deleteSql, [id], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error("Error deleting person:", deleteErr);
                res.status(500).json({ error: "An error occurred" });
            } else {
                console.log("Person deleted from the database.");
                res.json({ message: "Person deleted successfully" });
            }
        });
    };

    // Call the deleteData function to delete the person
    deleteData(id);
});


app.post("/updateXP", express.json(), (req, res) => {
    const { id, xpPV } = req.body;

    // Function to update XP in the database
    const updateData = (id, xpPV) => {
        // Fetch the current XP value from the database
        con.query("SELECT xp FROM members WHERE id = ?", [id], (selectErr, selectResult) => {
            if (selectErr) {
                console.error("Error selecting XP:", selectErr);
                res.status(500).json({ error: "An error occurred" });
            } else {
                if (selectResult.length === 1) {
                    const currentXP = selectResult[0].xp;
                    const updatedXP = parseInt(currentXP, 10) + parseInt(xpPV, 10);

                    // Update the database with the new total XP value
                    con.query("UPDATE members SET xp = ? WHERE id = ?", [updatedXP, id], (updateErr, updateResult) => {
                        if (updateErr) {
                            console.error("Error updating XP:", updateErr);
                            res.status(500).json({ error: "An error occurred" });
                        } else {
                            console.log("XP updated in the database.");
                            res.json({ message: "XP updated successfully" });
                        }
                    });
                } else {
                    console.error("Person not found with the provided ID.");
                    res.status(404).json({ error: "Person not found" });
                }
            }
        });
    };

    // Call the updateData function to update the XP
    updateData(id, xpPV);
});

app.post("/updateUserName", express.json(), (req, res) => {
    const { id, fn, ln } = req.body;

    console.log(id, "omg")

    // Function to update XP in the database
    const updateNames = (id, fn, ln) => {
        // Update the database with the new total XP value
        con.query("UPDATE members SET first_name = ?, last_name = ? WHERE id = ?", [fn, ln, id], (updateErr, updateResult) => {
            if (updateErr) {
                console.error("Error updating XP:", updateErr);
                res.status(500).json({ error: "An error occurred" });
            } else {
                console.log("XP updated in the database.");
                res.json({ message: "XP updated successfully" });
            }
        });
    };

    // Call the updateData function to update the XP
    updateNames(id, fn, ln);
});

app.post("/fetchName", express.json(), (req, res) => {
    const { id } = req.body;

    // Function to fetch first_name and last_name from the database
    const fetchNames = (id) => {
        con.query("SELECT first_name, last_name FROM members WHERE id = ?", [id], (selectErr, selectResult) => {
            if (selectErr) {
                console.error("Error fetching names:", selectErr);
                res.status(500).json({ error: "An error occurred" });
            } else {
                if (selectResult.length === 1) {
                    const { first_name, last_name } = selectResult[0];
                    res.json({ first_name, last_name });
                } else {
                    console.error("Person not found with the provided ID.");
                    res.status(404).json({ error: "Person not found" });
                }
            }
        });
    };

    // Call the fetchNames function to retrieve first_name and last_name
    fetchNames(id);
});


app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server is running on port 3000");
    }
});