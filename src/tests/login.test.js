const Commensal = require("../js/model/commensal");

test("Test email", () => {
    const commensal = new Commensal();
    expect(commensal.isEmail("alexisao@hotmail.com")).toBe(true);
    expect(commensal.isEmail("@gmail.com")).toBe(false);
    expect(commensal.isEmail("a@.com")).toBe(false);
});