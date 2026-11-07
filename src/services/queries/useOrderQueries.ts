import { useMutation, useQuery } from '@tanstack/react-query';
import { api, type CreateOrderPayload } from '../api/client';

export function useCreateOrderMutation() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => api.createOrder(payload),
  });
}

export function useTrackOrderQuery(orderNumber: string | undefined) {
  return useQuery({
    queryKey: ['order', 'track', orderNumber],
    queryFn: async () => {
      if (!orderNumber) return null;
      try {
        const res = await api.trackOrder(orderNumber);
        return res.data;
      } catch (err) {
        console.warn(`Order ${orderNumber} not found on server:`, err);
        return null;
      }
    },
    enabled: Boolean(orderNumber),
    refetchInterval: 10000, // Poll every 10 seconds for live order status updates
  });
}

