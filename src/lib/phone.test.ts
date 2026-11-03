import assert from "node:assert/strict";
import { test } from "node:test";
import { formatPhone, normalizePhone } from "./phone";

test("numéros béninois à 10 chiffres", () => {
  assert.equal(normalizePhone("01 97 12 34 56"), "+2290197123456");
  assert.equal(normalizePhone("0197123456"), "+2290197123456");
  assert.equal(normalizePhone("+229 01 97 12 34 56"), "+2290197123456");
  assert.equal(normalizePhone("00229-01-97-12-34-56"), "+2290197123456");
});

test("anciens numéros à 8 chiffres refusés", () => {
  assert.equal(normalizePhone("97123456"), null);
  assert.equal(normalizePhone("+22997123456"), null);
});

test("numéros étrangers au format international", () => {
  assert.equal(normalizePhone("+33 6 12 34 56 78"), "+33612345678");
  assert.equal(normalizePhone("0033612345678"), "+33612345678");
  assert.equal(normalizePhone("0612345678"), null);
});

test("saisies invalides", () => {
  assert.equal(normalizePhone(""), null);
  assert.equal(normalizePhone("abc"), null);
  assert.equal(normalizePhone("+229 01 97 12 34"), null);
});

test("affichage", () => {
  assert.equal(formatPhone("+2290197123456"), "+229 01 97 12 34 56");
  assert.equal(formatPhone("+33612345678"), "+33612345678");
});
