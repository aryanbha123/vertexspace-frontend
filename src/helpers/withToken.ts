export const withToken = async <T>(
  cb: (token: string) => Promise<T>
): Promise<T> => {
  const token = "xyz"; // later: get from storage / cookie

  if (!token) {
    throw new Error("No auth token found");
  }

  return await cb(token);
};