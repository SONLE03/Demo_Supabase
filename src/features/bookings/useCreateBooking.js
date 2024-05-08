import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking() {
  const queryClint = useQueryClient();

  const { mutate: createBooking, isLoading: isCreating } = useMutation({
    mutationFn: createNewBooking,
    onSuccess: () => {
      toast.success("new booking successfully created");
      queryClint.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createBooking };
}
