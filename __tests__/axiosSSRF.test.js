import secureAxios from "../utils/secureAxios";
import axios from 'axios';
import { safeGet } from '../backend/src/utils/secureAxios.js';

test("blocks absolute URLs outside baseURL", async () => {
  await expect(
    secureAxios.get("http://evil.com/data")
  ).rejects.toThrow(/SSRF Protection/);
});
jest.mock('axios');

describe('secureAxios safeGet', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('blocks absolute URLs outside allowed domains', async () => {
    await expect(safeGet('http://evil.com/data')).rejects.toThrow(/Blocked unsafe URL/);
  });

  test('allows requests to permitted domains', async () => {
    axios.get.mockResolvedValue({ data: 'ok' });
    await expect(safeGet('https://ridb.recreation.gov')).resolves.toEqual({ data: 'ok' });
    expect(axios.get).toHaveBeenCalled();
  });
});
