import app from "../index.js";
import dotenv from "dotenv";
import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
chai.should();

chai.use(chaiHttp);
// chai.config.includeStack = true; // turn on stack trace
// chai.config.showDiff = false;
// chai.config.truncateThreshold = 0;

describe("blogs API", () => {
  /**
   * Test the USER route
   */
  before(() => {
    mongoose.connect(process.env.TEST_MONGO_URI);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Database connection failed"));
    db.once("open", () => {
      console.log("Database connection established");
    });
  });

  describe("GET all users", () => {
    it("It should GET all the users", (done) => {
      chai
        .request(app)
        .get("/users/")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });

    it("It should NOT GET all the users", (done) => {
      chai
        .request(app)
        .get("/user/")
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe("POST /users/signup", () => {
    it("It should POST a new user", (done) => {
      const number = Math.floor(Math.random() * 10000);
      const user = {
        fullName: "Test User",
        email: `test${number}@mail.com`,
        password: "password",
      };

      chai
        .request(app)
        .post("/users/signup")
        .send(user)
        .end((err, response) => {
          const newuser = response.body.data;
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eql("User registered successfully");
          response.body.should.have.property("data").should.be.a("object");
          response.body.should.have
            .property("data")
            .have.nested.property("fullName");
          response.body.should.have
            .property("data")
            .have.nested.property("email");
          response.body.should.have
            .property("data")
            .have.nested.property("password");
          // chai
          //   .request(app)
          //   .delete("/users/" + newuser._id)
          //   .end((err, response) => {
          //     response.should.have.status(200);
          //     response.body.should.have.property("message").eql("User deleted");
          done();
          //   });
        });
    });

    it("It should POST a new admin", (done) => {
      const number = Math.floor(Math.random() * 10000);
      const user = {
        fullName: "Test User",
        email: `test${number}@mail.com`,
        password: "password",
        role: "admin",
      };

      chai
        .request(app)
        .post("/users/signup")
        .send(user)
        .end((err, response) => {
          const newuser = response.body.data;
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eql("User registered successfully");
          response.body.should.have.property("data").should.be.a("object");
          response.body.should.have
            .property("data")
            .have.nested.property("fullName");
          response.body.should.have
            .property("data")
            .have.nested.property("email");
          response.body.should.have
            .property("data")
            .have.nested.property("password");
          // chai
          //   .request(app)
          //   .delete("/users/" + newuser._id)
          //   .end((err, response) => {
          //     response.should.have.status(200);
          //     response.body.should.have.property("message").eql("User deleted");
          done();
          //   });
        });
    });

    it("It should NOT POST a new user because the user already exists", (done) => {
      const number = Math.floor(Math.random() * 10000);
      const user = {
        fullName: "Test User",
        email: `test${number}@mail.com`,
        password: "password",
      };

      chai
        .request(app)
        .post("/users/signup")
        .send(user)
        .end((err, response) => {
          response.should.have.status(201);
          chai
            .request(app)
            .post("/users/signup")
            .send(user)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.be.a("object");
              response.body.should.have
                .property("message")
                .eql("User arleady exists");
              done();
            });
        });
    });
  });

  describe("POST /users/login", () => {
    it("It should log the user in", (done) => {
      const number = Math.floor(Math.random() * 10000);
      const user = {
        fullName: "Test User",
        email: `test${number}@mail.com`,
        password: "password",
      };

      chai
        .request(app)
        .post("/users/signup")
        .send(user)
        .end((err, response) => {
          response.should.have.status(201);
          const loguser = {
            email: user.email,
            password: user.password,
          };
          chai
            .request(app)
            .post("/users/login")
            .send(loguser)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a("object");
              response.body.should.have
                .property("message")
                .eql("User successfully logged in");
              response.body.should.have.property("token");
              done();
            });
        });
    });

    it("It should NOT log the user in because user doesn't exist", (done) => {
      const user = {
        email: "doesn'texist@alustudent.com",
        password: "password",
      };

      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eql("User doesn't exist");
          done();
        });
    });
  });

  /**
   * Test the BLOG route
   */

  describe("GET all blogs", () => {
    it("It should GET all the blogs", (done) => {
      chai
        .request(app)
        .get("/blogs/")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });

    it("It should NOT GET all the blogs", (done) => {
      chai
        .request(app)
        .get("/blog/")
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe("GET blogs/:id", () => {
    it("It should GET a blog by ID", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end(async (err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          await chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .then((response) => {
              response.should.have.status(201);
              // console.log(response);
              const blog = response.body.data;
              chai
                .request(app)
                .get("/blogs/" + blog._id)
                .end((err, response) => {
                  response.should.have.status(200);
                  response.body.should.be.a("object");
                  response.body.should.have.property("message").eql("One blog");
                  response.body.should.have
                    .property("data")
                    .should.be.a("object");
                  response.body.should.have
                    .property("data")
                    .have.nested.property("title");
                  response.body.should.have
                    .property("data")
                    .have.nested.property("content");
                  response.body.should.have
                    .property("data")
                    .have.nested.property("coverImage");
                  response.body.should.have
                    .property("data")
                    .have.nested.property("references");
                  response.body.should.have
                    .property("data")
                    .have.nested.property("category");
                  response.body.should.have
                    .property("data")
                    .have.nested.property("_id")
                    .eq(blog._id);
                  chai
                    .request(app)
                    .delete("/blogs/" + blog._id)
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, response) => {
                      response.should.have.status(200);
                      response.body.should.have
                        .property("message")
                        .eql("Blog deleted");
                      done();
                    });
                });
            });
        });
    });

    it("It should NOT GET a blog by ID", (done) => {
      const blogId = "63dd1db41dd1da6d77db58ce";

      chai
        .request(app)
        .get("/blogs/" + blogId)
        .end((err, response) => {
          response.should.have.status(404);
          response.should.be.a("object");
          response.body.should.have
            .property("message")
            .eql("There is no blog with that id");
          done();
        });
    });
  });

  describe("POST /blogs", () => {
    it("It should POST a new blog", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };

      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;

          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              const blog = response.body.data;
              response.should.have.status(201);
              response.body.should.be.a("object");
              response.body.should.have
                .property("message")
                .eql("New Blog added successfully!");
              response.body.should.have.property("data").should.be.a("object");
              response.body.should.have
                .property("data")
                .have.nested.property("title");
              response.body.should.have
                .property("data")
                .have.nested.property("content");
              response.body.should.have
                .property("data")
                .have.nested.property("coverImage");
              response.body.should.have
                .property("data")
                .have.nested.property("references");
              response.body.should.have
                .property("data")
                .have.nested.property("category");
              response.body.should.have
                .property("data")
                .have.nested.property("_id");
              chai
                .request(app)
                .delete("/blogs/" + blog._id)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                  response.should.have.status(200);
                  response.body.should.have
                    .property("message")
                    .eql("Blog deleted");
                  done();
                });
            });
        });
    });

    it("It should NOT POST a new blog when the logged in user is not an admin", (done) => {
      const user = {
        email: "melissa@gmail.com",
        password: "password",
      };

      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;

          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(401);
              response.body.should.have
                .property("message")
                .eql("Request denied. Only for admin");
              done();
            });
        });
    });

    it("It should NOT POST a new blog when not logged in", (done) => {
      chai
        .request(app)
        .post("/blogs")
        .attach(
          "coverImage",
          fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
          "test_image.png"
        )
        .field("title", "Test title")
        .field(
          "content",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        )
        .field("category", "category")
        .field("references", "references")
        .end((err, response) => {
          response.should.have.status(403);
          response.body.should.have.property("message").eql("Not logged in");
          done();
        });
    });

    it("It should NOT POST a new blog without the title property", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a("array");
              // .nested.include({
              //   message: "Blog title required",
              //   path: ["title"],
              //   type: "any.required",
              //   context: {
              //     label: "title",
              //     key: "title",
              //   },
              // });
              done();
            });
        });
    });
  });

  describe("PATCH /blogs/:id", () => {
    it("It should update an image of an existing blog", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(201);
              // console.log(response);
              const blog = response.body.data;
              chai
                .request(app)
                .patch("/blogs/" + blog._id)
                .set({ Authorization: `Bearer ${token}` })
                .attach(
                  "coverImage",
                  fs.readFileSync(
                    path.join(__dirname, "../assets/test_image.png")
                  ),
                  "test_image.png"
                )
                .end((err, response) => {
                  response.should.have.status(200);
                  response.body.should.be.a("object");
                  response.body.should.have
                    .property("coverImage")
                    .not.equal(blog.coverImage);
                  chai
                    .request(app)
                    .delete("/blogs/" + blog._id)
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, response) => {
                      response.should.have.status(200);
                      response.body.should.have
                        .property("message")
                        .eql("Blog deleted");
                      done();
                    });
                });
            });
        });
    });

    it("It should update the category, references, and content of an existing blog", (done) => {
      // const blogId = "63e4c94eff1d354e96ac98c7";
      const blogUpdates = {
        category: "Updated category",
        references: "Updated references",
        content:
          "Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        title: "Updated Title",
      };
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(201);
              const blog = response.body.data;
              chai
                .request(app)
                .patch("/blogs/" + blog._id)
                .set({ Authorization: `Bearer ${token}` })
                .send(blogUpdates)
                .end((err, response) => {
                  response.should.have.status(200);
                  response.body.should.be.a("object");
                  response.body.should.have
                    .property("category")
                    .not.equal(blog.category);
                  response.body.should.have
                    .property("title")
                    .not.equal(blog.title);
                  response.body.should.have
                    .property("references")
                    .not.equal(blog.references);
                  response.body.should.have
                    .property("content")
                    .not.equal(blog.content);
                  chai
                    .request(app)
                    .delete("/blogs/" + blog._id)
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, response) => {
                      response.should.have.status(200);
                      response.body.should.have
                        .property("message")
                        .eql("Blog deleted");
                      done();
                    });
                });
            });
        });
    });

    it("It should NOT update a non-existing blog", (done) => {
      const blogId = "638e4167c2ded750f8ef9408";
      const blogUpdates = {
        category: "updated category",
      };
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .patch("/blogs/" + blogId)
            .set({ Authorization: `Bearer ${token}` })
            .send(blogUpdates)
            .end((err, response) => {
              response.should.have.status(404);
              response.body.should.be.a("object");
              response.body.should.have
                .property("message")
                .equal("Blog doesn't exist");
              done();
            });
        });
    });
  });

  describe("DELETE /blogs/:id", () => {
    it("It should DELETE an existing blog", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(201);
              // console.log(response);
              const blog = response.body.data;
              chai
                .request(app)
                .delete("/blogs/" + blog._id)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                  response.should.have.status(200);
                  response.body.should.have
                    .property("message")
                    .eql("Blog deleted");
                  done();
                });
            });
        });
    });
  });

  /**
   * Test the QUERY route
   */

  describe("POST /queries", () => {
    it("It should POST a new query", (done) => {
      const query = {
        fullName: "Eve evely",
        email: "eve@gmail.com",
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      };

      chai
        .request(app)
        .post("/queries")
        .send(query)
        .end((err, response) => {
          const newquery = response.body.data;
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eql("New query sent successfully!");
          response.body.should.have.property("data").should.be.a("object");
          response.body.should.have
            .property("data")
            .have.nested.property("fullName");
          response.body.should.have
            .property("data")
            .have.nested.property("email");
          response.body.should.have
            .property("data")
            .have.nested.property("message");
          chai
            .request(app)
            .delete("/queries/" + newquery._id)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.have
                .property("message")
                .eql("Query deleted!");
              done();
            });
        });
    });

    it("It should NOT POST a new query without sender's name", (done) => {
      const query = {
        email: "eve@gmail.com",
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      };

      chai
        .request(app)
        .post("/queries")
        .send(query)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /queries", () => {
    it("It should GET all the queries", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .get("/blogs/")
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a("object");
              done();
            });
        });
    });

    it("It should NOT GET all the queries because the user is not admin", (done) => {
      const user = {
        email: "melissa@gmail.com",
        password: "password",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .get("/queries/")
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
              response.should.have.status(401);
              done();
            });
        });
    });
  });

  /**
   * Test the Comment route
   */

  describe("POST /blogs/:id/comments", () => {
    it("It should add a comment to an existing blog", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(201);
              // console.log(response);
              const blog = response.body.data;
              const comment = { comment: "Insightful" };
              chai
                .request(app)
                .post("/blogs/" + blog._id + "/comments/")
                .set({ Authorization: `Bearer ${token}` })
                .send(comment)
                .end((err, response) => {
                  response.should.have.status(201);
                  response.body.should.be.a("object");
                  response.body.should.have.property("data");
                  chai
                    .request(app)
                    .delete("/blogs/" + blog._id)
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, response) => {
                      response.should.have.status(200);
                      response.body.should.have
                        .property("message")
                        .eql("Blog deleted");
                      done();
                    });
                });
            });
        });
    });
  });

  describe("GET /blogs/:id/comments", () => {
    it("It should get all comment on an existing blog", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(201);
              // console.log(response);
              const blog = response.body.data;
              const comment = { comment: "Insightful" };
              chai
                .request(app)
                .post("/blogs/" + blog._id + "/comments/")
                .set({ Authorization: `Bearer ${token}` })
                .send(comment)
                .end((err, response) => {
                  response.should.have.status(201);
                  chai
                    .request(app)
                    .get("/blogs/" + blog._id + "/comments/")
                    .end((err, response) => {
                      response.should.have.status(200);
                      response.body.should.be.a("object");
                      response.body.should.have
                        .property("blogId")
                        .eql(blog._id);
                      response.body.should.have.property("comments");
                      chai
                        .request(app)
                        .delete("/blogs/" + blog._id)
                        .set({ Authorization: `Bearer ${token}` })
                        .end((err, response) => {
                          response.should.have.status(200);
                          response.body.should.have
                            .property("message")
                            .eql("Blog deleted");
                          done();
                        });
                    });
                });
            });
        });
    });
  });

  /**
   * Test the LIKE route
   */
  describe("POST /blogs/:id/likes", () => {
    it("It should like/unlike an existing blog", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test like functionality")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(201);
              // console.log(response);
              const blog = response.body.data;
              chai
                .request(app)
                .post("/blogs/" + blog._id + "/likes/")
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                  response.should.have.status(201);
                  response.body.should.be.a("object");
                  response.body.should.have
                    .property("message")
                    .eql("liked/unliked");
                  response.body.should.have.property("data");
                  chai
                    .request(app)
                    .delete("/blogs/" + blog._id)
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, response) => {
                      response.should.have.status(200);
                      response.body.should.have
                        .property("message")
                        .eql("Blog deleted");
                      done();
                    });
                });
            });
        });
    });
  });

  describe("POST /blogs/:id/likes", () => {
    it("It should like/unlike an existing blog", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test Unlike blog")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(201);
              // console.log(response);
              const blog = response.body.data;
              chai
                .request(app)
                .post("/blogs/" + blog._id + "/likes/")
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                  response.should.have.status(201);
                  response.body.should.be.a("object");
                  chai
                    .request(app)
                    .post("/blogs/" + blog._id + "/likes/")
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, response) => {
                      response.should.have.status(201);
                      response.body.should.be.a("object");
                      response.body.should.have
                        .property("message")
                        .eql("liked/unliked");
                      chai
                        .request(app)
                        .delete("/blogs/" + blog._id)
                        .set({ Authorization: `Bearer ${token}` })
                        .end((err, response) => {
                          response.should.have.status(200);
                          response.body.should.have
                            .property("message")
                            .eql("Blog deleted");
                          done();
                        });
                    });
                });
            });
        });
    });
  });

  describe("GET /blogs/:id/likes", () => {
    it("It should get all likes on an existing blog", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(201);
              // console.log(response);
              const blog = response.body.data;

              chai
                .request(app)
                .get("/blogs/" + blog._id + "/likes/")
                .end((err, response) => {
                  response.should.have.status(200);
                  response.body.should.be.a("object");
                  response.body.should.have
                    .property("message")
                    .eql("All likes");
                  response.body.should.have.property("data");
                  chai
                    .request(app)
                    .delete("/blogs/" + blog._id)
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, response) => {
                      response.should.have.status(200);
                      response.body.should.have
                        .property("message")
                        .eql("Blog deleted");
                      done();
                    });
                });
            });
        });
    });
  });

  describe("GET /blogs/:id/like", () => {
    it("It should get one like on an existing blog", (done) => {
      const user = {
        email: "a.uwera@alustudent.com",
        password: "Aduwera",
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          const token = response.header.authenticate;
          chai
            .request(app)
            .post("/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .attach(
              "coverImage",
              fs.readFileSync(path.join(__dirname, "../assets/test_image.png")),
              "test_image.png"
            )
            .field("title", "Test title")
            .field(
              "content",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            )
            .field("category", "category")
            .field("references", "references")
            .end((err, response) => {
              response.should.have.status(201);
              // console.log(response);
              const blog = response.body.data;
              chai
                .request(app)
                .post("/blogs/" + blog._id + "/likes/")
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                  response.should.have.status(201);
                  response.body.should.be.a("object");
                  response.body.should.have
                    .property("message")
                    .eql("liked/unliked");
                  response.body.should.have.property("data");

                  chai
                    .request(app)
                    .get("/blogs/" + blog._id + "/like/")
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, response) => {
                      response.should.have.status(200);
                      response.body.should.be.a("object");
                      response.body.should.have
                        .property("message")
                        .eql("One like");
                      response.body.should.have.property("data");
                      chai
                        .request(app)
                        .delete("/blogs/" + blog._id)
                        .set({ Authorization: `Bearer ${token}` })
                        .end((err, response) => {
                          response.should.have.status(200);
                          response.body.should.have
                            .property("message")
                            .eql("Blog deleted");
                          done();
                        });
                    });
                });
            });
        });
    });
  });
});
