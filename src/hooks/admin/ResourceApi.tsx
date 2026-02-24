import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HttpClient from "../../services/HttpClient";
import { RESOURCE_ROUTES } from "../../constants/ApiRoutes";

export const useGetAllResources = () => {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(RESOURCE_ROUTES.GET_ALL_RESOURCES);
      return res.data;
    },
  });
};

export const useGetResourceById = (id: number) => {
  return useQuery({
    queryKey: ["resources", id],
    queryFn: async () => {
      const res = await HttpClient.get<any>(RESOURCE_ROUTES.GET_RESOURCE_BY_ID(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createResource"],
    mutationFn: async (data: any) => {
      const res = await HttpClient.post<any>(RESOURCE_ROUTES.CREATE_RESOURCE, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useUpdateResource = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateResource", id],
    mutationFn: async (data: any) => {
      const res = await HttpClient.put<any>(RESOURCE_ROUTES.UPDATE_RESOURCE(id), data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources", id] });
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteResource"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.del<any>(RESOURCE_ROUTES.DELETE_RESOURCE(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useHardDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["hardDeleteResource"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.del<any>(RESOURCE_ROUTES.HARD_DELETE_RESOURCE(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useGetResourcesByType = (type: "ROOM" | "DESK" | "PARKING") => {
  return useQuery({
    queryKey: ["resources", "type", type],
    queryFn: async () => {
      const res = await HttpClient.get<any>(RESOURCE_ROUTES.GET_RESOURCES_BY_TYPE(type));
      return res.data;
    },
    enabled: !!type,
  });
};

export const useGetBookableResources = () => {
  return useQuery({
    queryKey: ["resources", "bookable"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(RESOURCE_ROUTES.GET_BOOKABLE_RESOURCES);
      return res.data;
    },
  });
};

export const useGetAssignableDesks = () => {
  return useQuery({
    queryKey: ["resources", "desks", "assignable"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(RESOURCE_ROUTES.GET_ASSIGNABLE_DESKS);
      return res.data;
    },
  });
};

export const useGetAssignableDesksByDepartment = (departmentId: number) => {
  return useQuery({
    queryKey: ["resources", "desks", "assignable", "department", departmentId],
    queryFn: async () => {
      const res = await HttpClient.get<any>(RESOURCE_ROUTES.GET_ASSIGNABLE_DESKS_BY_DEPARTMENT(departmentId));
      return res.data;
    },
    enabled: !!departmentId,
  });
};

export const useChangeRoomBookingType = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["changeRoomBookingType", roomId],
    mutationFn: async (newBookingType: "EXCLUSIVE" | "SHARED") => {
      const res = await HttpClient.post<any>(RESOURCE_ROUTES.CHANGE_ROOM_BOOKING_TYPE(roomId, newBookingType));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources", roomId] });
    },
  });
};

export const useChangeDeskMode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["changeDeskMode"],
    mutationFn: async ({ deskId, newMode }: { deskId: number; newMode: "ASSIGNED" | "HOT_DESK" }) => {
      const res = await HttpClient.post<any>(RESOURCE_ROUTES.CHANGE_DESK_MODE(deskId, newMode));
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources", variables.deskId] });
    },
  });
};
