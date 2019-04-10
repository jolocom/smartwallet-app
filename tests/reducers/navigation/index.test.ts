import { navigationReducer as reducer } from "src/reducers/navigation/"

describe("navigation reducer", () => {
  it("should initialize correctly", () => {
    const test = reducer(undefined, { type: "@INIT" })
    expect(test.routes[0].routeName).toBe("Landing")
  })
})
