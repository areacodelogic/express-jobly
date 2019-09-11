const sqlForPartialUpdate = require('../../helpers/partialUpdate')

describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field",
      function () {
        const { query, values} = sqlForPartialUpdate(
          "companies",
          {name: "testname"},
          "name",
          "handle"
        )
      

        expect(query).toEqual("UPDATE companies SET name=$1 WHERE name=$2 RETURNING *")
        
        expect(values).toEqual(["testname", "handle"])

    // // FIXME: write real tests!
    // expect(false).toEqual(true);

  });
});
