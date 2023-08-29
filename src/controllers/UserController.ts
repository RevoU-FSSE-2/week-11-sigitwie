import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserDAO from "../dao/UserDao";
import { generateToken, verifyToken } from "../utils/AuthService";
import sequelize from "../utils/db";
import { UserAttributes } from "../models/UserModel";

const userDao = new UserDAO(sequelize);

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Email format validation using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }

    // email uniqueness validation
    const existingUserByEmail = await userDao.getByEmail(email);
    const existingUserByUsername = await userDao.getByUsername(username);
    if (existingUserByEmail) {
      return res.status(400).send({ message: "Email already registered" });
    }
    if (existingUserByUsername) {
      return res.status(400).send({ message: "Username already taken" });
    }

    // password validation
    const isAlphanumeric = /^[a-zA-Z0-9]+$/;
    if (
      password.length < 8 ||
      !isAlphanumeric.test(password) ||
      password.includes(" ")
    ) {
      return res.status(400).send({
        message:
          "Password must be at least 8 characters long, alphanumeric, and must not contain spaces",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userDao.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = generateToken(newUser.id!, newUser.username, newUser.role);
    res.status(201).send({ token, user: newUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "Registration failed",
      error: (error as Error).message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userDao.getByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id!, user.username, user.role);
    res.status(200).send({ token, user });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({ message: "Login failed", error: (error as Error).message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // Decode JWT token to get the logged-in user's ID and role
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .send({ message: "Authentication token not provided" });
    }

    const decoded = verifyToken(token);
    const loggedInUserId = decoded.userId;
    const loggedInUserRole = decoded.role;

    // Check if user has access to this data
    if (loggedInUserRole !== "admin" && loggedInUserId !== userId) {
      return res
        .status(403)
        .send({ message: "You do not have permission to view this user data" });
    }

    const user = await userDao.getById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .send({ message: "Invalid token", error: error.message });
      }

      console.error("Error:", error.message);
      res
        .status(500)
        .send({ message: "Failed to fetch user", error: error.message });
    } else {
      console.error("An unexpected error occurred:", error);
      res.status(500).send({ message: "Failed to fetch user" });
    }
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userDao.getAllUsers();

    res.status(200).send({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      res
        .status(500)
        .send({ message: "Failed to retrieve users", error: error.message });
    } else {
      console.error("An unexpected error occurred:", error);
      res.status(500).send({ message: "Failed to retrieve users" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body as Partial<UserAttributes>;

    // Decode JWT token to get the logged-in user's ID and role
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .send({ message: "Authentication token not provided" });
    }

    const decoded = verifyToken(token);
    const loggedInUserId = decoded.userId;
    const loggedInUserRole = decoded.role;

    if (loggedInUserRole !== "admin" && loggedInUserId !== userId) {
      return res
        .status(403)
        .send({
          message: "You do not have permission to update this user data",
        });
    }

    // Periksa apakah username baru sudah digunakan oleh user lain
    if (updates.username) {
      const userWithSameUsername = await userDao.getByUsername(
        updates.username
      );
      if (userWithSameUsername && userWithSameUsername.id !== userId) {
        return res.status(400).send({ message: "Username already in use" });
      }
    }

    // Periksa apakah email baru sudah digunakan oleh user lain
    if (updates.email) {
      const userWithSameEmail = await userDao.getByEmail(updates.email);
      if (userWithSameEmail && userWithSameEmail.id !== userId) {
        return res.status(400).send({ message: "Email already in use" });
      }
    }

    // Jika mengubah password, hash yang baru
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await userDao.updateById(userId, updates);

    const updatedUser = await userDao.getById(userId);

    res.status(200).send({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .send({ message: "Invalid token", error: error.message });
      }

      console.error("Error:", error.message);
      res
        .status(500)
        .send({ message: "Failed to update user", error: error.message });
    } else {
      console.error("An unexpected error occurred:", error);
      res.status(500).send({ message: "Failed to update user" });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // Decode JWT token to get the logged-in user's ID and role
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .send({ message: "Authentication token not provided" });
    }

    const decoded = verifyToken(token);

    const loggedInUserId = decoded.userId;
    const loggedInUserRole = decoded.role;

    // Ensure user exists
    const user = await userDao.getById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if user is allowed to delete
    if (loggedInUserRole !== "admin" && loggedInUserId !== userId) {
      return res
        .status(403)
        .send({ message: "You do not have permission to delete this user" });
    }

    await userDao.deleteById(userId);

    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .send({ message: "Invalid token", error: error.message });
      }

      console.error("Error:", error.message);
      res
        .status(500)
        .send({ message: "Failed to delete user", error: error.message });
    } else {
      console.error("An unexpected error occurred:", error);
      res.status(500).send({ message: "Failed to delete user" });
    }
  }
};
