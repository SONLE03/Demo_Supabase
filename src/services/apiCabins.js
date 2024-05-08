import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  console.log(data);
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

export async function getCabinForBooking(startDate, endDate, guest) {
  try {
    // Truy vấn các cabin có capacity lớn hơn hoặc bằng số khách
    const { data: availableCabins, error: cabinError } = await supabase
      .from("cabins")
      .select("*")
      .gte("maxCapacity", guest); // Đổi từ "capacity" thành "maxCapacity"

    if (cabinError) {
      console.error(cabinError);
      throw new Error("Failed to load cabins");
    }

    // Truy vấn các booking trong khoảng thời gian từ startDate đến endDate
    const { data: bookedCabins, error: bookingError } = await supabase
      .from("bookings")
      .select("cabinId", "status") // Thêm "status" vào danh sách trường cần chọn
      .lte("startDate", endDate) // Đổi từ "end_date" thành "startDate"
      .gte("endDate", startDate); // Đổi từ "start_date" thành "endDate"

    if (bookingError) {
      console.error(bookingError);
      throw new Error("Failed to load bookings");
    }

    // Lọc các cabin chưa được booking trong khoảng thời gian đã cho
    const availableCabinsFiltered = availableCabins.filter((cabin) => {
      // Kiểm tra xem cabin_id không tồn tại trong danh sách các booking
      return !bookedCabins.some((booking) => booking.cabinId === cabin.id && booking.status !== "checked-out"); // Đổi từ "check-out" thành "checked-out"
    });

    return availableCabinsFiltered;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch available cabins");
  }
}



export async function createEditCabin(newCabin, id) {
  console.log(newCabin.imagePath)
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  // https://qenxbykcdxmsadiedxjz.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  // 1.create/edit cabin
  let query = supabase.from("cabins");
  // A) CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) EDIT
  if (id)
    query = query.update([{ ...newCabin, image: imagePath }]).eq("id", id);

  const { data, error } = await query.select().single();
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created");
  }
  // 2.upload image
  if (hasImagePath) return data;
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);
  // 3. Delete the cabin if there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Cabins could not be uploaded and cabin wasn't created");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }
  return data;
}
