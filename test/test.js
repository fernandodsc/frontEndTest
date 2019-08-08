const expect = require("chai").expect;
const fetch = require("node-fetch");

describe("Fetch user data", () => {
    it("Should return a JSON object", async () => {
        const response = await fetch("https://api.github.com/users/fernandodsc");
        expect(response.status).to.be.equal(200);

        const user = await response.json();
        expect(user).to.be.an("Object");
        expect(user.login).to.be.a("String");
    });
});

describe("Fetch user repositories", () => {
    it("Should return an array", async () => {
        const response = await fetch("https://api.github.com/users/fernandodsc/repos");
        expect(response.status).to.be.equal(200);

        const repos = await response.json();
        expect(repos).to.be.an("Array");
    });
});
