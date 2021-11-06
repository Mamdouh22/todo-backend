const { ok } = require("assert");
const express = require("express");
const fs = require("fs");
const { stringify } = require("querystring");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("<h1>hi there , this is the backend for todo list</h1>");
});

app.get("/todo", (req, res) => {
  fs.readFile("./store/store.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Server Error!");
    }
    const todo = JSON.parse(data);
    const result = todo.map((x) => x.complete);
    return res.send(`<h1>${result}</h1>`);
  });
});

app.put("/todo/:id/complete", (req, res) => {
  const id = req.params.id;

  console.log(id);
  const findtaskbyid = (todo, id) => {
    for (let i = 0; i < todo.length; i++) {
      if (todo[i].id === parseInt(id)) {
        return i;
      }
    }
    return -1;
  };

  fs.readFile("./store/store.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Server Error!");
    }
    let todo = JSON.parse(data);
    const findtask = findtaskbyid(todo, id);
    todo[findtask].complete = true;

    fs.writeFile("./store/store.json", JSON.stringify(todo), () => {
      return res.json({ status: "ok" });
    });
  });
  // return res.send("<h1>Task Compeleted!..</h1>");
});

app.post("/todo", (req, res) => {
  if (!req.body.name) {
    return res.send("you have to enter a todo item");
  }

  fs.readFile("./store/store.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Server Error!");
    }
    const todo = JSON.parse(data);
    const max = Math.max.apply(
      Math,
      todo.map((x) => x.id)
    );

    todo.push({
      id: max + 1,
      name: req.body.name,
      complete: false,
    });

    fs.writeFile("./store/store.json", JSON.stringify(todo), () => {
      return res.json({ status: "ok" });
    });
  });
});

app.listen(3000, () => {
  console.log("app running at port 3000");
});
