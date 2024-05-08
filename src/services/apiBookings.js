import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function createNewBooking(newBooking){
  try {
    // Lấy thông tin từ newBooking
    const { fullName, email, cabin, startDate, endDate, numGuests } = newBooking;
    const { data: cabinData, error: cabinError } = await supabase
      .from("cabins")
      .select("regularPrice, discount")
      .eq("id", cabin)
      .single();

    if (cabinError) {
      throw new Error("Failed to fetch cabin price: " + cabinError.message);
    }
    const cabinPrice = cabinData.regularPrice;
    const cabinDiscount = cabinData.discount;
    // Tính số ngày đặt phòng
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numNights = Math.round((end - start) / (1000 * 60 * 60 * 24));
    console.log(numNights);
    // Tính tổng giá trị của đặt phòng
    const totalPrice = numNights * (cabinPrice - cabinDiscount);
      const { data: guest, error: guestError } = await supabase
      .from("guests")
      .insert([{ fullName, email }])
      .select("id")
      .single();
    if (guestError) {
      throw new Error("Failed to create new guest: " + guestError.message);
    }
    
    const guestId = guest.id;
    
    const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert([
      {
        guestId: guestId,
        cabinId: cabin,
        startDate: startDate,
        endDate: endDate,
        numGuests: numGuests,
        status: 'unconfirmed',
        totalPrice: totalPrice,
        numNights: numNights
      }
    ])
    .single();
    
    if (bookingError) {
      throw new Error("Failed to create new booking: " + bookingError.message);
    }
    
    return booking;
  } catch (error) {
    // Xử lý lỗi nếu có
    throw new Error("Failed to create new booking: " + error.message);
  }
}

// export async function getBookings({ filter, sortBy }) {
// export async function getBookings({ filter, page }) {
export async function getBookings({ filter }) {
  let query = supabase
    .from("bookings")
    .select(
      "id , created_at, startDate,endDate,numNights,numGuests,status, totalPrice, cabins(name), guests(fullName,email)",
      { count: "exact" }
    );
  // todo: filter
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);
  const { data, error, count } = await query;
  // todo: sort
  // if (sortBy)
  //   query = query.order(sortBy.field, {
  //     ascending: sortBy.direction === "asc",
  //   });
  // if (page) {
  //   const from = (page - 1) * PAGE_SIZE;
  //   const to = from + PAGE_SIZE - 1;
  //   console.log(from, to);
  //   query = query.range(from, to);
  // }
  if (error) {
    console.error(error);
    throw new Error("Bookings could not be created");
  }
  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  console.log(data);
  return data;
}



export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
