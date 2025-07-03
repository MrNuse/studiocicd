import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { callCbAfterTime, toSoroAsync } from "./3";

describe("test con funzioni asincrone", () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    describe(toSoroAsync.name, () => {
        it("",async  () => {

            const promise = toSoroAsync()
            
            await vi.advanceTimersByTimeAsync(1500)
            
            const result = await promise
            
            expect(result).toBe(true)
        })
    })

    describe(callCbAfterTime.name, () => {
        const mockCb = vi.fn()

        it("", async () => {  
            callCbAfterTime(mockCb)

            expect(mockCb).not.toHaveBeenCalled()

            await vi.advanceTimersByTimeAsync(10000)
            
            expect(mockCb).toHaveBeenCalled()
        })

    })
})