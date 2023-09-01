[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/XqBuIcOG)


# NexTa : Text-Based Social Media Application

A unique and minimalist social media platform built around text interactions. This application provides a streamlined experience for users seeking a more text-focused and distraction-free social environment.

Follow this link to view **[live API testing](https://w11.eswe.dev/v1/api-docs/)**

## Technologies Used:

- **Backend:** Node.js with Express.js
- **Database:** Sequelize ORM with Amazon RDS: MySQL
- **Hosting:** AWS Lightsail for API server hosting
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger UI

## Infrastructure Details:

- **Amazon RDS: MySQL:** Provides a managed relational database service, ensuring high availability, backup, and scalability for our application's data.
- **AWS Lightsail:** A simple virtual private server solution from Amazon Web Services, used for hosting our backend API, ensuring fast response times and reliable uptime.

## **Usage & Features**

1. **User Authentication:** 
   - Users can register a new account using the `/v1/api/user/register` endpoint.
   - Users can log in using the `/v1/api/user/login` endpoint.

2. **CRUD Operations for Posts:**
   - Create a new post, retrieve individual or all posts, update a post's details, and delete a post.

3. **Comments on Posts:**
   - Users can comment on posts and perform CRUD operations on those comments.

4. **Friendship System:**
   - Users can send, accept, or decline friend requests. They can also view and manage their list of friends.

## List API Endpoints:

| No. | Endpoint                                | Method | Summary                                  | Example JSON                                                                                                                 |
|-----|-----------------------------------------|--------|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| 1   | `/v1/api/user/register`                 | POST   | Register a new user                      | `{"username": "john_doe", "email": "john.doe@example.com", "password": "password123"}`                                        |
| 2   | `/v1/api/user/login`                    | POST   | User login                               | `{"email": "john.doe@example.com", "password": "password123"}`                                                               |
| 3   | `/v1/api/user/account/{id}`             | GET    | Retrieve user by ID                      | -                                                                                                                            |
| 4   | `/v1/api/user/account/{id}`             | PUT    | Update user by ID                        | `{"username": "john_doe_updated", "email": "john.doe.updated@example.com", "password": "newPassword123"}`                     |
| 5   | `/v1/api/user/account/{id}`             | DELETE | Delete user by ID                        | -                                                                                                                            |
| 6   | `/v1/api/user/accounts`                 | GET    | Retrieve all users                       | -                                                                                                                            |
| 7   | `/v1/api/posts/create`                  | POST   | Create a new post                        | `{"content": "This is a post.", "userId": 1}`                                                                                 |
| 8   | `/v1/api/posts/{postId}`                | GET    | Retrieve a post by ID                    | -                                                                                                                            |
| 9   | `/v1/api/posts/update/{postId}`         | PUT    | Update a post by ID                      | `{"content": "Updated post content.", "userId": 1}`                                                                           |
| 10  | `/v1/api/posts/delete/{postId}`         | DELETE | Delete a post by ID                      | -                                                                                                                            |
| 11  | `/v1/api/posts/user/{userId}`           | GET    | Retrieve all posts of a user by userID   | -                                                                                                                            |
| 12  | `/v1/api/posts/all`                     | GET    | Retrieve all posts                       | -                                                                                                                            |
| 13  | `/v1/api/comments/create`               | POST   | Create a comment                         | `{"userId": 1, "postId": 2, "content": "This is a comment."}`                                                                |
| 14  | `/v1/api/comments/{id}`                 | GET    | Get a comment by ID                      | -                                                                                                                            |
| 15  | `/v1/api/comments/post/{postId}`        | GET    | Get a comment by Post ID                 | -                                                                                                                            |
| 16  | `/v1/api/comments/update/{id}`          | PUT    | Update a comment by ID                   | `{"userId": 1, "postId": 2, "content": "Updated comment."}`                                                                  |
| 17  | `/v1/api/comments/delete/{id}`          | DELETE | Delete a comment by ID                   | -                                                                                                                            |
| 18  | `/v1/api/friendships/add`               | POST   | Create a friend request                  | `{"requesterId": 1, "requesteeId": 2}`                                                                                       |
| 19  | `/v1/api/friendships/{id}`              | GET    | Get a friendship by ID                   | -                                                                                                                            |
| 20  | `/v1/api/friendships/update/{id}`       | PUT    | Update friendship status                 | `{"status": "ACCEPTED", "requesteeId": 2}`                                                                                   |
| 21  | `/v1/api/friendships/delete/{id}`       | DELETE | Delete a friendship by ID                | -                                                                                                                            |
| 22  | `/v1/api/friendships/status`            | GET    | Get friendships by status                | -                                                                                                                            |


## **Setup & Installation**

1. **Clone the Repository:**
   ```
   git clone [repository-url]
   ```

2. **Install Dependencies:**
   ```
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the Application:**
   ```
   npm start
   ```
---



## **Summary & Appreciation**

This project is designed as a social communication platform, enabling users to share content, engage in discussions, and interact through a friendship system. I hope that this platform will provide added value and facilitate meaningful interactions amongst its user community. Thank you so much for taking the time to read through this documentation. Your support and feedback are invaluable to us and play a crucial role in the success and evolution of this project.

---