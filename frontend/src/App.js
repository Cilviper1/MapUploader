fetch("http://localhost:5500/api/login", {
  method: "POST",
  body: JSON.stringify({ username, password }),
  headers: { "Content-Type": "application/json" }
})
  .then(res => res.json())
  .then(data => console.log("hello world"));