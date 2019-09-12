process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
let company1;

describe("Company Route Tests", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM companies");
    let response = await db.query(`
      INSERT INTO companies (
        handle,
        name,
        num_employees,
        description,
        logo_url)
        VALUES(
          'TST',
          'Testerosa',
          100,
          'We make tests.',
          'https://imgur.com/OWCKylr')
        RETURNING handle, name, num_employees, description, logo_url
    `);

    company1 = response.rows[0];
  });

  describe("GET /companies", function () {
    test("Gets list of companies", async function () {
      const response = await request(app).get("/companies");
      const companies = response.body.companies;

      expect(companies).toHaveLength(1);
      expect(companies[0]).toHaveProperty("handle");
    });
  });

  describe("GET /companies/?search=Testerosa", function () {
    test("Gets company with searched name", async function () {
      const response = await request(app).get("/companies?search=Testerosa");
      const companies = response.body.companies;

      expect(companies).toHaveLength(1);
      expect(companies[0]).toHaveProperty("name");
      expect(companies[0].name).toBe("Testerosa");
    });
  });

  describe("GET /companies?max_employees=101", function () {
    test("Gets company with max employees", async function () {
      const response = await request(app).get("/companies?max_employees=101");
      const companies = response.body.companies;

      expect(companies).toHaveLength(1);
      expect(companies[0]).toHaveProperty("name");
      expect(companies[0].num_employees).toBe(100);
    });
  });


  describe("GET /companies?search=Testerosa&max_employees=101&min_employees=99", function () {
    test("Gets company with max employees", async function () {
      const response = await request(app).get("/companies?search=Testerosa&max_employees=101&min_employees=99");
      const companies = response.body.companies;

      expect(companies).toHaveLength(1);
      expect(companies[0]).toHaveProperty("name");
      expect(companies[0].name).toBe("Testerosa")
      expect(companies[0].num_employees).toBe(100);
    });
  });

  describe("POST /companies", function () {
    test("Creates a new company", async function () {
      const response = await request(app)
        .post("/companies")
        .send({
          handle: 'BRO',
          name: "Bro Force",
          num_employees: 10,
          description: "We are bros.",
          logo_url: "https://bros.com"
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.company).toHaveProperty('handle');
    });
  });

  describe("GET /companies/:handle", function () {
    test("Gets single company", async function () {
      const response = await request(app).get(`/companies/${company1.handle}`);
      const company = response.body.company;

      expect(company).toHaveProperty("handle");
      expect(company.handle).toBe("TST");
    });
  });

  describe("PATCH /companies/:handle", function () {
    test("Updates a company", async function () {
      const response = await request(app)
        .patch(`/companies/${company1.handle}`)
        .send({
          name: "Testy Testers",
          description: "We test real good."
        })
      const company = response.body.company;

      expect(company.name).toBe("Testy Testers");
      expect(company.description).toBe("We test real good.");
    });
  });

  describe("DELETE /companies/:handle", function () {
    test("Deletes a company", async function () {
      const response = await request(app).delete(`/companies/${company1.handle}`)

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({message: "Company deleted."});
    });
  });


});

afterAll(async function () {
  await db.end();
});