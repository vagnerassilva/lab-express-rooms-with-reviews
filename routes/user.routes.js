const router = require("express").Router();

const UserService = require("..services/user.service");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/signup", async (req, res, next) => {
  try {
    const userService = new UserService(req.body);

    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
    const passwordregex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/g;

    if (!userService.isValid(userService.email, emailRegex)) {
      return res.status(400).json({
        error: "O campo email e obrigatorio e deve ser um email valido",
      });
    }

    if (!userService.isValid(userService.password, passwordregex)) {
      return res.status(400).json({
        error: "Este e-mail ja esta cadastrado!",
      });
    }

    const insertResult = await userService.createUser();
    return res.status(201).json(insertResult);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const userService = new UserService(req.body);

    const loginResult = await userService.login();
    if (loginResult) {
      return res.status(200).json(loginResult);
    } else {
      return res.status(401).json({ error: "Acesso negado" });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    console.log(req.user);
    return res.status(200).json(req, user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;