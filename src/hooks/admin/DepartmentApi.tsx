import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HttpClient from "../../services/HttpClient";
import { DEPARTMENT_ROUTES } from "../../constants/ApiRoutes";

export const useGetActiveDepartments = () => {
  return useQuery({
    queryKey: ["departments", "active"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(DEPARTMENT_ROUTES.GET_ACTIVE_DEPARTMENTS);
      return res.data;
    },
  });
};

export const useGetDepartmentById = (id: number) => {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: async () => {
      const res = await HttpClient.get<any>(DEPARTMENT_ROUTES.GET_DEPARTMENT_BY_ID(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createDepartment"],
    mutationFn: async (data: any) => {
      const res = await HttpClient.post<any>(DEPARTMENT_ROUTES.CREATE_DEPARTMENT, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useUpdateDepartment = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateDepartment", id],
    mutationFn: async (data: any) => {
      const res = await HttpClient.put<any>(DEPARTMENT_ROUTES.UPDATE_DEPARTMENT(id), data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", id] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteDepartment"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.del<any>(DEPARTMENT_ROUTES.DELETE_DEPARTMENT(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useHardDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["hardDeleteDepartment"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.del<any>(DEPARTMENT_ROUTES.HARD_DELETE_DEPARTMENT(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};
