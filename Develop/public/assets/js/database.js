const request = window.indexedDB.open("budget", 1);
let db;

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore("pending", { keyPath: "_id" });
};

request.onerror = function (e) {
  console.log("There was an error" + e.target.err);
};
