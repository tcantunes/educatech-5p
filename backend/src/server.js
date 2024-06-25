const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("../src/routes/userRoutes");
const path = require("path");
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const User = require("./models/User");
require("dotenv").config();

const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv:/${dbHost}:${dbPassword}@educatech.y9fxekf.mongodb.net/?retryWrites=true&w=majority&appName=educatech`
  )
  .then(() => {
    console.log("Conexão estabelecida com sucesso");
  })
  .catch((error) => {
    console.log("Erro ao conectar", error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "../Front/src")));

app.post("/api/cadastro", async (req, res) => {
  try {
    const { name, email, password, cidade, estado } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      cidade,
      estado,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(400).json({ message: "Erro ao cadastrar usuário" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const firstName = user.name.split(" ")[0];

    res.status(200).json({ firstName });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});


app.get("/login-page", (req, res) => {
  res.sendFile(path.join(__dirname, "../Front/src/pages/login.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor conectado na porta ${PORT}`);
});
