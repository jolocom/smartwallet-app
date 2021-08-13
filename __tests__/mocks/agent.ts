export const mockedAgent = {
  passwordStore: {
    getPassword: jest.fn().mockResolvedValue(true),
  },
}
