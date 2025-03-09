export const getUserRole = async (userId: string, token: string) => {
  const response = await fetch(`https://ulylan.vercel.app/api/usuarios/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
