const express = require("express");
const shortid = require("shortid");

const server = express();
server.use(express.json());

let users = [
  { id: 1, bio: "this is a bio #1", name: "Jonathan" },
  { id: 2, bio: "this is a bio #2", name: "Lindsey" },
  { id: 3, bio: "this is a bio #3", name: "Taylor" },
];

//POST REQUESTS

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(400).json({
      errorMessage: "Please provide a name and a bio for the user",
    });
  } else {
    try {
      const newUser = {
        name: name,
        bio: bio,
        id: shortid.generate(),
      };
      users.push(newUser);
      res.status(201).json(newUser);
    } catch {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
    }
  }
});

//GET REQUESTS

server.get("/api/users", (req, res) => {
  try {
    res.status(200).json(users);
  } catch {
    res.status(500).json({
      errorMessage: "The users information could not be retrieved.",
    });
  }
});

server.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  

  const user = users.find((u) => u.id === id);

  console.log(user);
  if (!user) {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  } else {
    try {
      res.status(200).json(user);
    } catch {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved.",
      });
    }
  }
});

server.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

  const deleted = users.find((u) => u.id === id);
  console.log(deleted)

  if(deleted) {
     users = users.filter((user) => user.id !== id)
      res.status(200).json(users).end()
  } else if (!deleted) {
      res.status(404).json({message: "The user with the specified ID does not exist."})
  } else {
      res.status(500).json({errorMessage: "The user could not be removed"})
  }
})

server.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id)

    const edited = req.body

    let userToEdit = users.find((u) => u.id === id)

    if(!edited.name || !edited.bio) {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    } else if(!userToEdit) {
        res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
    } else if(userToEdit) {
        Object.assign(userToEdit, edited)
        res.status(200).json(userToEdit)
    } else {
        res.status(500).json({errorMessage: "The user information could not be modified"})
    }
})



const port = 5000;
server.listen(port, () => console.log("The server is running..."));
