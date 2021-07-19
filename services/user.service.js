const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User.model");

class UserService {
  constructor(user) {
    this.name = user.name;
    this.email = user.mail;
    this.password = user.password;
  }

  isValid(field, validationRegex) {
    if (!field || !field.match(validationRegex)) {
      return false;
    }
    return true;
  }

  async getUserByEmail(email) {
    const user = await UserModel.findOne({ email: email });
    return user;
  }

  async userExists(email) {
    const user = await this.getUserByEmail(email);

    if (user) {
      return true;
    }

    return false;
  }

  hashPassword(plainTextPassword) {
    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);

    const hashedPassword = bcrypt.hash(plainTextPassword, salt);

    return hashedPassword;
  }

  async createUser() {
    return UserModel.create({
      name: this.name,
      email: this.email,
      passwordHash: this.hashPassword(this.password),
    }).then((insertResult) => insertResult);
  }

  async login() {
    const user = await this.getUserByEmail(this.email);

    if (!user) {
      throw new Error("Usuario nao cadastrado");
    }

    if (bcrypt.compareSync(this.password, user.passwordHash)) {
      return { token: token, user: user };
    }

    return false;
  }

  generateToken(user) {
    const signSecret = process.env.TOKEN_SIGN_SECRET;

    delete user.passwordHash;

    const token = jwt.sign(user.toJSON(), signSecret, { expiresIn: "6h" });

    return token;
  }
}

module.exports = userService;