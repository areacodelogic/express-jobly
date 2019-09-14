process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

let user1;

describe("User Route Tests", function () {
  beforeEach(async function () {
    await db.query('DELETE FROM users');
    console.log("GOT HERE!");
    let user1Response = await db.query(`
      INSERT INTO users(
        username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin)
        VALUES(
          'TestGuy',
          'password',
          'Test',
          'Guy',
          'testguy@test.com',
          'https://thelad.com/photo',
          false
        )
        RETURNING 
          username, 
          password, 
          first_name, 
          last_name, 
          email, 
          photo_url, 
          is_admin
      `);

    user1 = user1Response.rows[0];

    let user2Response = await db.query(`
    INSERT INTO users(
      username,
      password,
      first_name,
      last_name,
      email,
      photo_url,
      is_admin)
      VALUES(
        'TestGal',
        'password',
        'Test',
        'Gal',
        'testgal@test.com',
        'https://thegal.com/photo',
        false
      )
      RETURNING 
        username, 
        password, 
        first_name, 
        last_name, 
        email, 
        photo_url, 
        is_admin
    `);

    user2 = user2Response.rows[0];
  });

describe("GET /users", function () {
  test("Gets list of users", async function () {
    const response = await request(app).get("/users");
    const users = response.body.users;

    expect(users).toHaveLength(2);
    expect(users[1]).toHaveProperty("first_name");
    expect(users[1].first_name).toBe("Test");
  });
});

describe("GET /users", function () {
  test("Gets list of users", async function () {
    const response = await request(app).get("/users");
    const users = response.body.users;

    expect(users).toHaveLength(2);
    expect(users[0]).toHaveProperty("last_name");
    expect(users[0].last_name).toBe("Gal");
  });
});

// /// write a get to ensure that the db has been updated 

// // **************ADD SAD PATHS TO THE TEST*******************//

describe("POST /users", function () {
  test("Creates a new user", async function () {
    const response = await request(app)
      .post("/users")
      .send({
        username: "TestGuy2",
        password: "password",
        first_name: "Test",
        last_name: "Guy2",
        email: "testguy2@gmail.com",
        photo_url: "testguy2@gmail.com/photo_url",
        is_admin: false
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toHaveProperty("username");

    const response2 = await db.query(`
    SELECT username FROM users WHERE username='TestGuy2'`)
    expect(response2.rows.length).toBe(1);
  });
});

  // // get to make sure patch has done what it is supposed to

  // describe("PATCH /users/:username", function() {
  //   test("Updates a user", async function() {
  //     const response = await request(app)
  //       .patch(`/users/${user1.username}`)
  //       .send({
  //         title: "Position3",
  //         salary: 100000000
  //       });
  //     const user = response.body.user;

  //     expect(user.title).toBe("Position3");
  //     expect(user.salary).toBe(100000000);
  //   });
  // });

  // // get to make sure delete has done what it is supposed to


  // describe("DELETE /jobs/:id", function() {
  //   test("Deletes a company", async function() {
  //     const response = await request(app).delete(`/jobs/${job1.id}`);

  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toEqual({ message: "Job deleted." });
  //   });
  // });
});

afterAll(async function () {
  await db.end();
});
