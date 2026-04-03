'use strict'

// Espera a que se seleccione una categoría
let classificationList = document.querySelector("#classificationList")
classificationList.addEventListener("change", function () {
    let classification_id = classificationList.value
    console.log(`classification_id is: ${classification_id}`)
    let classIdURL = "/inv/getInventory/" + classification_id
    
    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            console.log(data);
            buildInventoryList(data); // Llama a la función para armar la tabla
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
})

// Construye la tabla con los datos recibidos
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    dataTable += '<tbody>';
    
    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        // Estos links todavía no funcionan, los haremos en la siguiente actividad
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';
    inventoryDisplay.innerHTML = dataTable;
}