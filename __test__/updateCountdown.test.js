import { updateCountdown } from "../src/client/js/updateCountdown"

describe ("Testing that importing updateCountdown went well", () => {
    test("Testing updateCountdown()", () => {
        expect(updateCountdown).toBeDefined();
    })
})