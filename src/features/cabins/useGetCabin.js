import { useQuery } from "@tanstack/react-query";
import { getCabinForBooking } from "../../services/apiCabins";

export function useGetCabin(newCabin) {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    // queryKey: ["cabins", newCabin.startDate, newCabin.endDate, newCabin.guest],
    // queryFn: () => getCabinForBooking(newCabin.startDate, newCabin.endDate, newCabin.guest),
      queryKey: ["cabins", newCabin.startDate, newCabin.endDate, newCabin.guest],
      queryFn: () => getCabinForBooking(newCabin.startDate, newCabin.endDate, newCabin.guest),
  });

  return { isLoading, error, cabins };
}