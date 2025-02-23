import { auth } from "@/utils/firebase/client";

export const getBalanceById = async (balanceId: string) => {
  const userToken = await auth.currentUser?.getIdToken();
  const response = await fetch(`/api/balances/diarios/${balanceId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  });
  return response;
};

export const getAllBalances = async (page: number, startDate: Date, endDate: Date) => {
  const userToken = await auth.currentUser?.getIdToken();
  const response = await fetch(
    `/api/balances/diarios?page=${page}&startDate=${startDate}&endDate=${endDate}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  return response;
};

export const createBalance = async (balanceData: object) => {
  const userToken = await auth.currentUser?.getIdToken();
  const response = await fetch(`/api/balances/diarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify(balanceData),
  });
  return response;
};

export const updateBalance = async (balanceId: string, balanceData: object) => {
  const userToken = await auth.currentUser?.getIdToken();
  const response = await fetch(`/api/balances/diarios/${balanceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify(balanceData),
  });
  return response;
};

export const deleteBalance = async (balanceId: string) => {
  const userToken = await auth.currentUser?.getIdToken();
  const response = await fetch(`/api/balances/diarios/${balanceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  });
  return response;
};
