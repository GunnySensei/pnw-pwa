//create variable to hold db connection
let db;

//establish connection to IndexedDB database
const request = indexedDB.open("pnw-pwa", 1);

//event will emit if the db version changes
request.onupgradeneeded = function (event) {
  //save ref to db
  const db = event.target.result;
  //create object store
  db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadtransaction();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["new_transaction"], "readwrite");

  const transactionObjectStore = transaction.objectStore("new_transaction");

  transactionObjectStore.add(record);
}

function uploadtransaction() {
  const transaction = db.transaction(["new_transaction"], "readwrite");

  const transactionObjectStore = transaction.objectStore("new_transaction");

  const getAll = transactionObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          //open another transaction
          const transaction = db.transaction(["new_transaction", "readwrite"]);
          //access new_transaction object store
          const transactionObjectStore =
            transaction.objectStore("new_transaction");
          //clear items in store
          transactionObjectStore.clear();

          alert("All saved transaction have been submitted!");
        })
        .catch((err) => console.log(err));
    }
  };
}

window.addEventListener("online", uploadtransaction);
