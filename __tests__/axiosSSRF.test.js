import secureAxios from "../utils/secureAxios";

test("blocks absolute URLs outside baseURL", async () => {
  await expect(
    secureAxios.get("http://evil.com/data")
  ).rejects.toThrow(/SSRF Protection/);
});