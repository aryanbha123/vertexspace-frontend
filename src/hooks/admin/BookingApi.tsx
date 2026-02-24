import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HttpClient from "../../services/HttpClient";
import { BOOKING_ROUTES } from "../../constants/ApiRoutes";

export const useGetAllBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(BOOKING_ROUTES.GET_ALL_BOOKINGS);
      return res.data;
    },
  });
};

export const useGetMyBookings = () => {
  return useQuery({
    queryKey: ["bookings", "my"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(BOOKING_ROUTES.GET_MY_BOOKINGS);
      return res.data;
    },
  });
};

export const useGetBookingsByUser = (userId: number) => {
  return useQuery({
    queryKey: ["bookings", "user", userId],
    queryFn: async () => {
      const res = await HttpClient.get<any>(BOOKING_ROUTES.GET_BOOKINGS_BY_USER(userId));
      return res.data;
    },
    enabled: !!userId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createBooking"],
    mutationFn: async (data: { resourceId: number; startUtc: string; endUtc: string }) => {
      const res = await HttpClient.post<any>(BOOKING_ROUTES.CREATE_BOOKING, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cancelBooking"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.post<any>(BOOKING_ROUTES.CANCEL_BOOKING(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useGetBestSlots = () => {
  return useMutation({
    mutationKey: ["bestSlots"],
    mutationFn: async (data: { date: string; durationMinutes: number; resourceCriteria: any }) => {
      const res = await HttpClient.post<any>(BOOKING_ROUTES.GET_BEST_SLOTS, data);
      return res.data;
    },
  });
};
