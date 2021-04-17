const Commensal = require("../js/model/commensal");

test("Test email", () => {
	const commensal = new Commensal();
	expect(commensal.isEmail("alexisao@hotmail.com")).toBe(true);
	expect(commensal.isEmail("@gmail.com")).toBe(false);
	expect(commensal.isEmail("a@.com")).toBe(false);
});

test("Test password", () => {
	const commensal = new Commensal();
	expect(commensal.isPassword("qwertyui")).toBe(true);
	expect(commensal.isPassword("1234567")).not.toBe(true);
	expect(commensal.isPassword("qwerty7")).not.toBe(true);
});