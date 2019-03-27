import express from "express";
import * as joi from "joi";

import "./lib/env";

const app = express();
app.use(express.json());

const genres = [
  {
    id: 1,
    name: "Thriler"
  },
  {
    id: 2,
    name: "Western"
  },
  {
    id: 3,
    name: "Darma"
  }
];

function validation(source: string) {
  const schema = {
    name: joi
      .string()
      .required()
      .min(3)
  };
  return joi.validate(source, schema);
}

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  if (!req.params.id) {
    res.status(400).send("add correct query parameter");
    return;
  }
  const genre = genres.find(g => g.id === Number(req.params.id));
  if (!genre) {
    res.status(404).send("Not Found");
    return;
  }
  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const { error } = validation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === Number(req.params.id));
  if (!genre) {
    res.status(404).send("Not Found");
    return;
  }
  const { error } = validation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  genre.name = req.body.name;
  res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === Number(req.params.id));
  if (!genre) {
    res.status(404).send("Not Found");
    return;
  }
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`server is running on port: ${port}`));
