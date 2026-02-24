import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HttpClient from "../../services/HttpClient";
import { WAITLIST_ROUTES } from "../../constants/ApiRoutes";

export const useGetAllWaitlistEntries = () => {
  return useQuery({
    queryKey: ["waitlist"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(WAITLIST_ROUTES.GET_ALL_ENTRIES);
      return res.data;
    },
  });
};

export const useGetMyWaitlistEntries = () => {
  return useQuery({
    queryKey: ["waitlist", "my"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(WAITLIST_ROUTES.GET_MY_ENTRIES);
      return res.data;
    },
  });
};

export const useGetWaitlistOffers = () => {
  return useQuery({
    queryKey: ["waitlist", "offers"],
    queryFn: async () => {
      const res = await HttpClient.get<any>(WAITLIST_ROUTES.GET_OFFERS);
      return res.data;
    },
  });
};

export const useJoinWaitlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["joinWaitlist"],
    mutationFn: async (data: { resourceId: number; startUtc: string; endUtc: string }) => {
      const res = await HttpClient.post<any>(WAITLIST_ROUTES.JOIN_WAITLIST, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
};

export const useLeaveWaitlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["leaveWaitlist"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.post<any>(WAITLIST_ROUTES.LEAVE_WAITLIST(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
};

export const useAcceptWaitlistOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["acceptWaitlistOffer"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.post<any>(WAITLIST_ROUTES.ACCEPT_OFFER(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useDeclineWaitlistOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["declineWaitlistOffer"],
    mutationFn: async (id: number) => {
      const res = await HttpClient.post<any>(WAITLIST_ROUTES.DECLINE_OFFER(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
};
