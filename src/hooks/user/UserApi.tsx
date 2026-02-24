import { useMutation, useQuery } from "@tanstack/react-query";
import HttpClient from "../../services/HttpClient";
import { USER_ROUTES } from "../../constants/ApiRoutes";

export const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: any) => {
      const res = await HttpClient.post(`${USER_ROUTES.REGISTER_USER}`, data);
      return res.data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: any) => {
      const res = await HttpClient.post<any>(`${USER_ROUTES.LOGIN_USER}`, data);
      return res.data;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const res = await HttpClient.post<any>(`${USER_ROUTES.LOGOUT}`);
      return res.data;
    },
  });
};

export const useMe = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(`${USER_ROUTES.GET_ME}`);
      return res.data;
    },
    enabled: enabled,
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(`${USER_ROUTES.GET_ALL_USERS}`);
      return res.data;
    },
  });
};
