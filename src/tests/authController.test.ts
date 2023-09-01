import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/AuthService";
import UserDAO from "../dao/UserDao";
import * as UserController from "../controllers/UserController";

// Mocking our dependencies
jest.mock("bcrypt");
jest.mock("../utils/AuthService");
jest.mock("../dao/UserDao");

const mockRequest = (data: any): Request => {
  return data as Request;
};

const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Mock console.error
let errorSpy: jest.SpyInstance;

beforeAll(() => {
  errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(async () => {
  errorSpy.mockRestore();
  jest.restoreAllMocks();
});

describe("register", () => {
  it("should register a new user successfully", async () => {
    const req = mockRequest({
      body: {
        username: "testUser",
        email: "test@example.com",
        password: "Test1234",
      },
    });

    const res = mockResponse();

    // Mocking the behavior of our dependencies for this test case
    (UserDAO.prototype.getByEmail as jest.Mock).mockResolvedValue(null);
    (UserDAO.prototype.getByUsername as jest.Mock).mockResolvedValue(null);
    (UserDAO.prototype.create as jest.Mock).mockResolvedValue({
      id: 1,
      username: "testUser",
      email: "test@example.com",
      password: "hashedPassword",
      role: "user",
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (generateToken as jest.Mock).mockReturnValue("sampleToken");

    await UserController.register(req, res);

    // Assertions to ensure our controller behaves as expected
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      token: "sampleToken",
      user: expect.objectContaining({
        username: "testUser",
        email: "test@example.com",
      }),
    });
  });

  describe("login", () => {
    it("should handle login error correctly", async () => {
      const req = mockRequest({
        body: {
          email: "test@example.com",
          password: "Test1234",
        },
      });

      const res = mockResponse();

      (UserDAO.prototype.getByEmail as jest.Mock).mockRejectedValue(
        new Error("Unexpected Error")
      );

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Login failed",
        error: "Unexpected Error",
      });

      // Check if console.error was called with the expected error
      expect(errorSpy).toHaveBeenCalledWith(
        "Error:",
        new Error("Unexpected Error")
      );
    });

    it("should return 400 for invalid email or password", async () => {
      const req = mockRequest({
        body: {
          email: "wrong@example.com",
          password: "wrongPassword",
        },
      });

      const res = mockResponse();

      (UserDAO.prototype.getByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      const req = mockRequest({
        body: {
          email: "test@example.com",
          password: "Test1234",
        },
      });

      const res = mockResponse();
      const errorMsg = "Unexpected Error";

      (UserDAO.prototype.getByEmail as jest.Mock).mockRejectedValue(
        new Error(errorMsg)
      );

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Login failed",
        error: errorMsg,
      });
    });
  });

  describe("getUserById", () => {
    it("should return user details if authenticated as admin", async () => {
      const req = mockRequest({
        params: { id: "1" },
        headers: {
          authorization: "Bearer sampleValidTokenForAdmin",
        },
      });

      const res = mockResponse();

      (verifyToken as jest.Mock).mockReturnValue({ userId: 2, role: "admin" });
      (UserDAO.prototype.getById as jest.Mock).mockResolvedValue({
        id: 1,
        username: "testUser",
        email: "test@example.com",
      });

      await UserController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          username: "testUser",
          email: "test@example.com",
        })
      );
    });

    it("should return error if user tries to access another user's data", async () => {
      const req = mockRequest({
        params: { id: "2" },
        headers: {
          authorization: "Bearer sampleValidTokenForUser",
        },
      });

      const res = mockResponse();

      (verifyToken as jest.Mock).mockReturnValue({ userId: 1, role: "user" });

      await UserController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        message: "You do not have permission to view this user data",
      });
    });

    describe("getAllUsers", () => {
      it("should successfully retrieve all users", async () => {
        const req = mockRequest({});
        const res = mockResponse();

        // Mocking the behavior of our dependency for this test case
        (UserDAO.prototype.getAllUsers as jest.Mock).mockResolvedValue([
          { id: 1, username: "testUser1", email: "test1@example.com" },
          { id: 2, username: "testUser2", email: "test2@example.com" },
        ]);

        await UserController.getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
          message: "Users retrieved successfully",
          data: [
            { id: 1, username: "testUser1", email: "test1@example.com" },
            { id: 2, username: "testUser2", email: "test2@example.com" },
          ],
        });
      });
    });

    describe("updateUser", () => {
      it("should allow a regular user to update their own data", async () => {
        const req = mockRequest({
          params: { id: "1" },
          body: {
            username: "updatedUser",
            email: "updated@example.com",
          },
          headers: {
            authorization: "Bearer sampleValidTokenForUser",
          },
        });
        const res = mockResponse();

        // Mocking verifyToken to simulate a valid user token
        (verifyToken as jest.Mock).mockReturnValue({
          userId: 1,
          role: "user",
        });

        (UserDAO.prototype.getByUsername as jest.Mock).mockResolvedValue(null);
        (UserDAO.prototype.getByEmail as jest.Mock).mockResolvedValue(null);
        (UserDAO.prototype.updateById as jest.Mock).mockResolvedValue(true);
        (UserDAO.prototype.getById as jest.Mock).mockResolvedValue({
          id: 1,
          username: "updatedUser",
          email: "updated@example.com",
        });

        await UserController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
          message: "User updated successfully",
          data: {
            id: 1,
            username: "updatedUser",
            email: "updated@example.com",
          },
        });
      });
    });

    describe("deleteUser", () => {
      it("should allow an admin to delete another user", async () => {
        const req = mockRequest({
          params: { id: "2" }, // id of the user to be deleted
          headers: {
            authorization: "Bearer sampleValidTokenForAdmin",
          },
        });
        const res = mockResponse();

        // Mocking verifyToken to simulate an admin user token
        (verifyToken as jest.Mock).mockReturnValue({
          userId: 1, // admin's id
          role: "admin",
        });

        // Mocking the getById method to simulate finding the user to be deleted
        (UserDAO.prototype.getById as jest.Mock).mockResolvedValue({
          id: 2,
          username: "userToDelete",
          email: "toDelete@example.com",
        });

        // Mocking the deleteById method to simulate successful deletion
        (UserDAO.prototype.deleteById as jest.Mock).mockResolvedValue(true);

        await UserController.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
          message: "User deleted successfully",
        });
      });

      it("should allow a user to delete their own account", async () => {
        const userIdToDelete = 2; // Let's say this is the ID of the user who wishes to delete their own account
        const req = mockRequest({
          params: { id: userIdToDelete.toString() },
          headers: {
            authorization: "Bearer sampleValidTokenForUser",
          },
        });
        const res = mockResponse();

        // Mocking verifyToken to simulate the token of the user trying to delete their account
        (verifyToken as jest.Mock).mockReturnValue({
          userId: userIdToDelete,
          role: "user",
        });

        // Mocking the getById method to simulate finding the user in the database
        (UserDAO.prototype.getById as jest.Mock).mockResolvedValue({
          id: userIdToDelete,
          username: "userSelfDelete",
          email: "selfDelete@example.com",
        });

        // Mocking the deleteById method to simulate successful deletion
        (UserDAO.prototype.deleteById as jest.Mock).mockResolvedValue(true);

        await UserController.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
          message: "User deleted successfully",
        });
      });
    });
  });
});
