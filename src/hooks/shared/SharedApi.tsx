import { useQuery } from "@tanstack/react-query";
import { DEPARTMENT_ROUTES } from "../../constants/ApiRoutes";
import HttpClient from "../../services/HttpClient";

export const useGetAllDepartments =  () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await HttpClient.get<any>(
        `${DEPARTMENT_ROUTES.GET_ALL_DEPARTMENTS}`,
      );
      return res.data;
    },

  });
};
