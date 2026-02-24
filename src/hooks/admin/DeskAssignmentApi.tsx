import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HttpClient from "../../services/HttpClient";
import { DESK_ASSIGNMENT_ROUTES } from "../../constants/ApiRoutes";

export const useGetAllDeskAssignments = () => {
  return useQuery({
    queryKey: ["deskAssignments"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(DESK_ASSIGNMENT_ROUTES.GET_ALL_ASSIGNMENTS);
      return res.data;
    },
  });
};

export const useGetDeskAssignmentById = (id: number) => {
  return useQuery({
    queryKey: ["deskAssignments", id],
    queryFn: async () => {
      const res = await HttpClient.get<any>(DESK_ASSIGNMENT_ROUTES.GET_ASSIGNMENT_BY_ID(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useGetDeskAssignmentsByDepartment = (departmentId: number) => {
  return useQuery({
    queryKey: ["deskAssignments", "department", departmentId],
    queryFn: async () => {
      const res = await HttpClient.get<any>(DESK_ASSIGNMENT_ROUTES.GET_ASSIGNMENTS_BY_DEPARTMENT(departmentId));
      return res.data;
    },
    enabled: !!departmentId,
  });
};

export const useCreateDeskAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createDeskAssignment"],
    mutationFn: async (data: any) => {
      const res = await HttpClient.post<any>(DESK_ASSIGNMENT_ROUTES.CREATE_ASSIGNMENT, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deskAssignments"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] }); // Invalidate resources because desk status might change
    },
  });
};

export const useUpdateDeskAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateDeskAssignment"],
    mutationFn: async ({ data, id }: { data: any; id: number }) => {
      const res = await HttpClient.put<any>(DESK_ASSIGNMENT_ROUTES.UPDATE_ASSIGNMENT(id), data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deskAssignments"] });
      queryClient.invalidateQueries({ queryKey: ["deskAssignments", variables.id] });
    },
  });
};

export const useDeleteDeskAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteDeskAssignment"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.del<any>(DESK_ASSIGNMENT_ROUTES.DELETE_ASSIGNMENT(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deskAssignments"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};
