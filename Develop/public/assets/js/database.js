const request = window.indexedDB.open("budget", 1);
let db;

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore("pending", { keyPath: "_id" });
};

request.onerror = function (e) {
  console.log("There was an error" + e.target.err);
};

request.onsuccess = function (e){
    db = e.target.result;
    if (window.navigator.onLine){
        getBalance();
    }
}


function saveRecord(input) {
  const transaction = db.transaction("pending", "readwrite");
  const store = transaction.objectStore("pending");
  store.add(input);
}

function getBalance() {
  const transaction = db.transaction("pending", "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function (e) {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(transaction),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          const transaction = db.transaction("pending", "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}
// listen for the app to be online
window.addEventListener('online', getBalance())