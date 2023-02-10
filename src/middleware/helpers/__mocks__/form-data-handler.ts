export const parseFormData = jest.fn(() => ({
  parsingError: null,
  fields: { plainData: JSON.stringify({ name: 'fields plainData mock' }) },
  files: [],
}));
