import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HttpClient from "../../services/HttpClient";
import { FLOOR_ROUTES } from "../../constants/ApiRoutes";

export const useGetAllFloors = () => {
  return useQuery({
    queryKey: ["floors"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(FLOOR_ROUTES.GET_ALL_FLOORS);
      return res.data;
    },
  });
};

export const useGetFloorById = (id: number) => {
  return useQuery({
    queryKey: ["floors", id],
    queryFn: async () => {
      const res = await HttpClient.get<any>(FLOOR_ROUTES.GET_FLOOR_BY_ID(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useGetFloorsByBuilding = (buildingId: number) => {
  return useQuery({
    queryKey: ["floors", "building", buildingId],
    queryFn: async () => {
      const res = await HttpClient.get<any>(FLOOR_ROUTES.GET_FLOORS_BY_BUILDING(buildingId));
      return res.data;
    },
    enabled: !!buildingId,
  });
};

export const useGetActiveFloorsByBuilding = (buildingId: number) => {
  return useQuery({
    queryKey: ["floors", "building", buildingId, "active"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(FLOOR_ROUTES.GET_ACTIVE_FLOORS_BY_BUILDING(buildingId));
      return res.data;
    },
    enabled: !!buildingId,
  });
};

export const useCreateFloor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createFloor"],
    mutationFn: async (data: any) => {
      const res = await HttpClient.post<any>(FLOOR_ROUTES.CREATE_FLOOR, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
    },
  });
};

export const useUpdateFloor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateFloor"],
    mutationFn: async ({ data, id }: { data: any; id: number }) => {
      const res = await HttpClient.put<any>(FLOOR_ROUTES.UPDATE_FLOOR(id), data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      queryClient.invalidateQueries({ queryKey: ["floors", variables.id] });
    },
  });
};

export const useDeleteFloor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteFloor"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.del<any>(FLOOR_ROUTES.DELETE_FLOOR(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
    },
  });
};

export const useHardDeleteFloor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["hardDeleteFloor"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.del<any>(FLOOR_ROUTES.HARD_DELETE_FLOOR(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
    },
  });
};
