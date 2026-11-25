import { formatDateFunction } from './utils'

describe("formatDateFunction", () => {
    it("formats a date in British English", () => {
      expect(formatDateFunction("2022-06-20")).toBe("Mon, 20 Jun 2022");
    });
  });