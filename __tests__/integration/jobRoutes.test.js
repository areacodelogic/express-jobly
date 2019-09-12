process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

let job1;

describe("Job Route Tests", function() {
  beforeEach(async function() {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies");

    let comResponse = await db.query(`INSERT INTO companies (
        handle,
        name,
        num_employees,
        description,
        logo_url)
        VALUES(
          'TES',
          'Testerosa',
          100,
          'We make tests.',
          'https://imgur.com/OWCKylr')
        RETURNING handle, name, num_employees, description, logo_url
    `);

    let jobResponse = await db.query(`
      INSERT INTO jobs(
        title,
        salary,
        equity,
        company_handle,
        date_posted)
        VALUES(
          'Position1',
          100000,
          0.5,
          'TES',
          current_timestamp)
        RETURNING id, title, salary, equity, company_handle, date_posted
    `);

    job1 = jobResponse.rows[0];
  });

  describe("GET /jobs", function() {
    test("Gets list of jobs", async function() {
      const response = await request(app).get("/jobs");
      const jobs = response.body.jobs;

      expect(jobs).toHaveLength(1);
      expect(jobs[0]).toHaveProperty("title");
    });
  });

  /// add a second job for searching test 

  describe("GET /jobs/?search=Position1", function() {
    test("Gets job with searched job", async function() {
      const response = await request(app).get("/jobs/?search=Position1");
      const jobs = response.body.jobs;

      expect(jobs).toHaveLength(1);
      expect(jobs[0]).toHaveProperty("title");
      expect(jobs[0].title).toBe("Position1");
    });
  });

  describe("GET /jobs?min_salary=90000", function() {
    test("Gets jobs with min salary", async function() {
      const response = await request(app).get("/jobs?min_salary=90000");
      const jobs = response.body.jobs;

      expect(jobs).toHaveLength(1);
      expect(jobs[0]).toHaveProperty("title");
      expect(jobs[0].salary).toBe(100000);
    });
  });

  describe("GET /jobs?search=Position1&min_salary=90000&min_equity=0.1", function() {
    test("Gets jobs with all 3 of our search terms", async function() {
      const response = await request(app).get(
        "/jobs?search=Position1&min_salary=90000&min_equity=0.1"
      );
      const jobs = response.body.jobs;

      expect(jobs).toHaveLength(1);
      expect(jobs[0]).toHaveProperty("title");
      expect(jobs[0].title).toBe("Position1");
      expect(jobs[0].salary).toBe(100000);
    });
  });

  /// write a get to ensure that the db has been updated 

  // **************ADD SAD PATHS TO THE TEST*******************//

  describe("POST /jobs", function() {
    test("Creates a new job", async function() {
      const response = await request(app)
        .post("/jobs")
        .send({
          title: "POSITION2",
          salary: 50000,
          equity: 0.5,
          company_handle: "TES"
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.job).toHaveProperty("title");
    });
  });

  describe("GET /jobs/:id", function() {
    test("Gets single job", async function() {
      const response = await request(app).get(`/jobs/${job1.id}`);
      const job = response.body.job;

      expect(job).toHaveProperty("title");
      expect(job.company_handle).toBe("TES");
    });
  });

  // get to make sure patch has done what it is supposed to

  describe("PATCH /jobs/:id", function() {
    test("Updates a job", async function() {
      const response = await request(app)
        .patch(`/jobs/${job1.id}`)
        .send({
          title: "Position3",
          salary: 100000000
        });
      const job = response.body.job;

      expect(job.title).toBe("Position3");
      expect(job.salary).toBe(100000000);
    });
  });

  // get to make sure delete has done what it is supposed to


  describe("DELETE /jobs/:id", function() {
    test("Deletes a company", async function() {
      const response = await request(app).delete(`/jobs/${job1.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: "Job deleted." });
    });
  });
});

afterAll(async function() {
  await db.end();
});
