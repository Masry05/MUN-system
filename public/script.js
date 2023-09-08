//document.getElementById("fetchButton").addEventListener("click", fetchData);
// Function to fetch data
function fetchData() {
    // Make an HTTP request to your Express.js server
    fetch("/fetch")
        .then(response => response.json())
        .then(data => {
            // Create a div element to contain the person elements
            const personContainer = document.createElement("div");
            personContainer.className = "mainDataContainer"; // Add a class for styling

            // Create person elements with the specified format
            data.forEach(rowData => {
                const person = document.createElement("div");
                person.className = "person";

                // Extract id, first name, last name, xp from the rowData
                const id = rowData.id || 'N/A';
                const fn = rowData.first_name || 'N/A';
                const ln = rowData.last_name || 'N/A';
                const xp = rowData.xp || 0;

                // Calculate level (xp/15)
                const level = `Level: ${Math.floor(xp / 15)}`;//
                
                // Calculate xp remainder (xp%15)
                const xpRemainder = `XP: ${xp % 15}`;

                // Combine first name and last name
                const fullName = `${fn} ${ln}`;

                // Populate the person element with the formatted data
                person.id ="person"+id;
                person.innerHTML = `
                    
                    <div class="id">${id}</div>
                    <div class="full_name">${fullName}</div>
                    <div class="level">${level}</div>
                    <div class="xp">${xpRemainder}/15</div>

                    <div class="xp-settings">
                        <input class="xp-input" id="input${id}" type="text" onkeydown="if(event.key=='Enter')
                        updateXP(${id});" oninput="CheckXpFields(this)">
                        <button class="add-button" onclick="updateXP(${id})">&#10003;</button>
                        <a href="#" class="btn" onclick="editName(${id})">
                            <i class="fas fa-pencil-alt"></i>
                        </a>
                        <a class="reset" id="${id}" onclick="resetXP(${id})">
                            <i class="fa-solid fa-rotate-right"></i>
                        </a>
                        <a class="delete" id="${id}" onclick="deletePerson(${id})">
                            <i class="fa-solid fa-trash-can"></i>
                        </a>
                    </div>
                `;

                // Append the person element to the container
                personContainer.appendChild(person);
            });

            // Display the person container in the "dataContainer" div
            const dataContainer = document.getElementById("dataContainer");
            dataContainer.innerHTML = '';
            dataContainer.appendChild(personContainer);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// Call fetchData function when the page loads
window.addEventListener("load", fetchData);

// Function to add a name to the database
function addName() {
    // Generate a random 3-digit ID
    const id = Math.floor(100 + Math.random() * 900); // Random number between 100 and 999 
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const fn = firstNameInput.value.replace(/ /g, "");
    const ln = lastNameInput.value.replace(/ /g, "");
    const xp = 0;

    const addButton = document.getElementById("addNameButton");
    const addButtonTxt = addButton.textContent;

    if (fn != "" && ln != ""){
        if (addButton.textContent == "Add"){
  
            // Create an object with all the data
            const data = { id, fn, ln, xp };

            // Make an HTTP POST request to add the name to the database
            fetch("/addName", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
            // Display a success message or handle the response as needed
            console.log(data.message);
            // After successfully adding the name, fetch updated data
            fetchData();
            firstNameInput.value = "" 
            lastNameInput.value = ""
            })
            .catch(error => {
                console.error("Error adding name:", error);
            });
        }
        else if (addButton.textContent == "Update") {
            //alert("still")
            const firstNameInput = document.getElementById("first-name");
            const lastNameInput = document.getElementById("last-name");

            const fn = firstNameInput.value.replace(/ /g, "");
            const ln = lastNameInput.value.replace(/ /g, "");
        
            const user_id = document.getElementById("addNameButton").value;


            // Create an object with the person's ID, first_name, last_name, and user_name
            const data = { id: user_id, fn: fn, ln: ln };
        
            // Make an HTTP POST request to update the person's data
            fetch("/updateUserName", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                // Display a success message or handle the response as needed
                console.log(data.message);
                // After successfully updating the data, fetch updated data
                fetchData();
                editBackName();
            })
            .catch(error => {
                console.error("Error updating the data:", error);
            });
        }
  
    }
    
}

// Call addName function when the "Add Name" button is clicked
document.getElementById("addNameButton").addEventListener("click", addName);


function deletePerson(personId) {
    flag = confirmPopUp("Delete");
    console.log(flag)
    //showConfirmation()
    if(flag){
    // Create an object with the person's ID
    const data = { id: personId };

    // Make an HTTP POST request to delete the person from the database
    fetch("/deletePerson", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        // Display a success message or handle the response as needed
        console.log(data.message);
        // After successfully deleting the person, fetch updated data
        fetchData();
    })
    .catch(error => {
        console.error("Error deleting the person:", error);
    });
}
}


function updateXP(personId) {
    xpField = document.getElementById("input"+personId)
    xpPlusValue = xpField.value

    const digitPattern = /^-?\d+$/;

    if (digitPattern.test(xpPlusValue)){

        // Create an object with the person's ID
        const data = { id: personId, xpPV: xpPlusValue };

        // Make an HTTP POST request to delete the person from the database
        fetch("/updateXP", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            // Display a success message or handle the response as needed
            console.log(data.message);
            // After successfully deleting the person, fetch updated data
            fetchData();
        })
        .catch(error => {
            console.error("Error deleting the person:", error);
        });
    }
}

function resetXP(personId) {
    flag = confirmPopUp("Reset XP");
    console.log(flag)
    //showConfirmation()
    if(flag){
    // Create an object with the person's ID
    const data = { id: personId };

    // Make an HTTP POST request to delete the person from the database
    fetch("/resetXP", {
         method: "POST",
        headers: {
           "Content-Type": "application/json",
         },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        // Display a success message or handle the response as needed
        console.log(data.message);
        // After successfully deleting the person, fetch updated data
        fetchData();
    })
    .catch(error => {
        console.error("Error reseting the xp:", error);
    });
}
}

function CheckFields(field) {
    
    const vl = field.value.replace(/ /g, "");


    if (vl == ""){
        field.style.borderColor = "red";
        field.style.boxShadow = "0px 0px 10px inset red";
    }
    else{
        field.style.borderColor = null;
        field.style.boxShadow = null;
    }
}

function CheckXpFields(field) {
    
    const vl = field.value.replace(/ /g, "");
    
    const digitPattern = /^-?\d+$/;

    if (digitPattern.test(vl)){
        field.style.borderColor = null;
        field.style.boxShadow = null;
    }
    else{
        field.style.borderColor = "red";
        field.style.boxShadow = "0px 0px 10px inset red";
    }
}

function editName(personId) {
    const addButton = document.getElementById("addNameButton");
    addButton.textContent = "Update";
    addButton.value = personId;
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");

    // Create an object with the person's ID to send to the server
    const data = { id: personId };

    // Make an HTTP POST request to fetch the person's data
    fetch("/fetchName", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        // Populate the input fields with the received data
        firstNameInput.value = data.first_name; // Handle if data.first_name is undefined
        lastNameInput.value = data.last_name; // Handle if data.last_name is undefined
    })
    .catch(error => {
        console.error("Error fetching the data:", error);
    });
}

function editBackName() {
    const addButton = document.getElementById("addNameButton");
    addButton.textContent = "Add";
    addButton.value = "addbtn";
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    firstNameInput.value = "";
    lastNameInput.value = "";
}


function moving(event){
    if(event.key==="Enter"){
        const firstNameInput = document.getElementById("first-name");
        const lastNameInput = document.getElementById("last-name");
        if(lastNameInput.value.replace(/ /g, "")==="")
            lastNameInput.focus();
        else if(firstNameInput.value.replace(/ /g, "")==="")
            firstNameInput.focus();
        else
            addName();
    }
}

function confirmPopUp(txt) {
    switch (txt) {
        case "Reset XP": 
            msg = "Are you sure you want to reset the XP?";
            break
            
        case "Delete": 
            msg = "Are you sure you want to delete this user?";
            break
    }
    // Display a confirmation dialog
    if (confirm(msg)) {
      // User clicked "OK," perform the delete operation
      return true
      // You can call your delete function or perform any other action here
    } else {
      // User clicked "Cancel" or closed the dialog, do nothing or handle accordingly
      return false
    }
  }


/*
// JavaScript function to show the confirmation popup
function showConfirmation() {
    var confirmationPopup = document.getElementById("confirmationPopup");
    confirmationPopup.style.display = "block";
}

// JavaScript function to handle the confirmation result
function confirmAction(result) {
    var confirmationPopup = document.getElementById("confirmationPopup");
    confirmationPopup.style.display = "none";
    
    if (result === true) {
        // User clicked Confirm
        alert("Confirmed!");
        return true
    } else {
        // User clicked Cancel
        alert("Canceled!");
        return false
    }
}
*/
