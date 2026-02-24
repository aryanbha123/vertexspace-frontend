import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HttpClient from "../../services/HttpClient";
import { BUILDING_ROUTES } from "../../constants/ApiRoutes";

export const useGetAllBuildings = () => {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(BUILDING_ROUTES.GET_ACTIVE_BUILDINGS);
      return res.data;
    },
  });
};

export const useGetActiveBuildings = () => {
  return useQuery({
    queryKey: ["buildings", "active"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(BUILDING_ROUTES.GET_ACTIVE_BUILDINGS);
      return res.data;
    },
  });
};

export const useGetBuildingById = (id: number) => {
  return useQuery({
    queryKey: ["buildings", id],
    queryFn: async () => {
      const res = await HttpClient.get<any>(BUILDING_ROUTES.GET_BUILDING_BY_ID(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createBuilding"],
    mutationFn: async ({data, id}:{data: any, id: number}) => {
      const res = await HttpClient.post<any>(BUILDING_ROUTES.CREATE_BUILDING, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateBuilding"],
    mutationFn: async ({data, id}:{data: any, id: number}) => {
      const res = await HttpClient.put<any>(BUILDING_ROUTES.UPDATE_BUILDING(id), data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteBuilding"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.del<any>(BUILDING_ROUTES.DELETE_BUILDING(id));
      console.log(res.data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};

export const useHardDeleteBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["hardDeleteBuilding"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.del<any>(BUILDING_ROUTES.HARD_DELETE_BUILDING(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};
