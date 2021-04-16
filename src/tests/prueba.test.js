const suma = require("../js/prueba");

test("Sumar 5 + 7 = 12", () => {
	expect(suma(5, 7)).toBe(12);
});