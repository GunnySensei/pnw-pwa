//create variable to hold db connection
let db;

//establish connection to IndexedDB database
const request = indexedDB.open('pnw-pwa', 1);

//event will emit if the db version changes
request.onupgradeneeded = function(event) {
    //save ref to db
    const db = event.target.result;
    //create object store
    db.createObjectStore('new_calculations')
}

request.onsuccess = function(event) {
    db = event.target.result;

    if(navigator.onLine) {
        //uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
}

function saveRecord(record) {
    const transaction = db.transaction(['new_calculations'], 'readwrite');

    const pizzaObjectStore = transaction.objectStore('new_calculations');

    pizzaObjectStore.add(record);
}