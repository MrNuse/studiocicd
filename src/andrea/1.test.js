import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";


describe("primi test con giorgino" , () => {
    const test = vi.fn()

    beforeAll(() => {
     test()
    })

    beforeEach(() => {
    })

    it("should expect true to be true", () => {
        expect(test).toHaveBeenCalledOnce()
    })

    it("chimata di configurazione + chiamata manuale", () => {
        test()
        expect(test).toHaveBeenCalledTimes(2)
    })



})