export const getUserRole = async (userId: string, token: string) => {
  const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
