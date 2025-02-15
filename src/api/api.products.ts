export const getBalanceById = async (balanceId: string) => {
  const response = await fetch(`/api/balances/diarios/${balanceId}`, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getAllBalances = async (page: number) => {
  const response = await fetch(`/api/balances/diarios?page=${page}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const createBalance = async (balanceData: any) => {
  const response = await fetch(`/api/balances/diarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(balanceData),
  });
  return response;
};

export const updateBalance = async (balanceId: string, balanceData: any) => {
  const response = await fetch(`/api/balances/diarios/${balanceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(balanceData),
  });
  return response;
};

export const deleteBalance = async (balanceId: string) => {
  const response = await fetch(`/api/balances/diarios/${balanceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
