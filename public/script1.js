//document.getElementById("fetchButton").addEventListener("click", fetchData);
// Function to fetch data
function fetchData() {
    // Make an HTTP request to your Express.js server
    fetch("/fetch")
    .then(response => response.json())
    .then(data => {
        // Create a table element
        const table = document.createElement("table");

        // Create a table header row
        const headerRow = document.createElement("tr");
        for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Create table rows with data
    data.forEach(rowData => {
        const row = document.createElement("tr");
        for (const key in rowData) {
            const cell = document.createElement("td");
            cell.textContent = rowData[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    });

    // Display the table in the "dataContainer" div
    const dataContainer = document.getElementById("dataContainer");
    dataContainer.innerHTML = '';
    dataContainer.appendChild(table);
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
    const fn = firstNameInput.value;
    const ln = lastNameInput.value;
    const xp = 0;
  
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

// Call addName function when the "Add Name" button is clicked
document.getElementById("addNameButton").addEventListener("click", addName);