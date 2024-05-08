import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckin() {
  const queryClint = useQueryClient();
  const { mutate: checkin, isLoading: isCheckingIn } = useMutation({
    mutationFn: (bookingId) =>
    updateBooking(bookingId, {
      status: "checked-in",
    }),
  onSuccess: (data) => {
    toast.success(`Booking #${data.id} successfully checked in`);
    queryClint.invalidateQueries({ active: true });
  },
  onError: () => toast.error(`there was an error while checking in`),
});

  return { checkin, isCheckingIn };
}
