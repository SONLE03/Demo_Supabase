import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import SelectCabin from "../../ui/SelectCabin";
import FormRow from "../../ui/FormRow";
import { useEditBooking } from "./useUpdateBooking";
import { useCreateBooking } from "./useCreateBooking";
import { useState } from "react";
import { useGetCabin } from "../cabins/useGetCabin";
import { useEffect } from "react";
import { debounce } from "lodash";

function CreateBookingForm({ bookingToEdit = {}, onClose }) {
  const { id: editId, ...editValue } = bookingToEdit;
  const { isCreating, createBooking } = useCreateBooking();
  const { isEditing, editBooking } = useEditBooking();
  const isWorking = isCreating || isEditing;
  const isEditSession = Boolean(editId);
  const [selectedCabin, setSelectedCabin] = useState(""); 

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? editValue : {},
  });

  const { cabins, isLoading: loadingCabins } = useGetCabin({
    startDate: getValues("startDate"),
    endDate: getValues("endDate"),
    guest: getValues("numGuests"),
  });

  // const delayedFetchData = debounce(() => {
  //   fetchData();
  // }, 300); 

  // useEffect(() => {
  //   delayedFetchData();
  //   return delayedFetchData.cancel; // Hủy debounce khi component unmounts hoặc useEffect re-run
  // }, [getValues("startDate"), getValues("endDate"), getValues("numGuest")]);

  // async function fetchData() {
  //   try {
  //     const { cabins } = await useGetCabin({
  //       startDate: getValues("startDate"),
  //       endDate: getValues("endDate"),
  //       guest: getValues("numGuest"),
  //     });
  //     // Gán giá trị mới cho state hoặc thực hiện các logic khác ở đây
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  const delayedFetchData = debounce((startDate, endDate, numGuests) => {
    fetchData(startDate, endDate, numGuests);
  }, 300);
  async function fetchData(startDate, endDate, numGuests) {
    try {
      await useGetCabin({
        startDate,
        endDate,
        guest: numGuests,
      });
      // You can update state or perform other actions here
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    // Extract input values
    const startDate = getValues("startDate");
    const endDate = getValues("endDate");
    const numGuests = getValues("numGuests");

    // Call delayedFetchData when inputs change
    delayedFetchData(startDate, endDate, numGuests);

    // Cancel debounce on unmount or when inputs change
    return delayedFetchData.cancel;
  }, [getValues, delayedFetchData]);

  
    function onSubmit(data) {
      const newData = { ...data, cabin: selectedCabin };
      alert(`Full name: ${newData.fullName}\nEmail: ${newData.email}\nStart Date: ${newData.startDate}\nEnd Date: ${newData.endDate}\nNum Guest: ${newData.numGuest}\nSelected Cabin: ${newData.cabin}`);
      if (isEditSession)
        editBooking(
          { newBookingData: { ...data}, id: editId },
          {
            onSuccess: (data) => {
              console.log(data);
              reset();
              onClose?.();
            },
          }
        );
      else
        createBooking(
          { ...newData},
          {
            onSuccess: (data) => {
              console.log(data);
              reset();
              onClose?.();
            },
          }
        );
    }

  function onError(errors) {
    console.log(errors);
  }



  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onClose ? "modal" : "regular"}
    >
      <FormRow label={"Full name"} error={errors.name?.message}>
        <Input
          disabled={isWorking}
          type="text"
          id="fullName"
          {...register("fullName", { required: "this field is required" })}
        />
      </FormRow>
      <FormRow label={"Email"} error={errors.email?.message}>
        <Input
          disabled={isWorking}
          type="text"
          id="email"
          {...register("email", { required: "this field is required" })}
        />
      </FormRow>
      <FormRow label={"Start Date"} error={errors.startDate?.message}>
        {
         <Input
          disabled={isWorking}
          type="date"
          id="startDate"
          {...register("startDate", { required: "this field is required" })}
          onChange={delayedFetchData}
        />
        }
      </FormRow>
      <FormRow label={"End Date"} error={errors.endDate?.message}>
        {
         <Input
          disabled={isWorking}
          type="date"
          id="endDate"
          {...register("endDate", { required: "this field is required" })}
          onChange={delayedFetchData}
        />
        }
      </FormRow>
      <FormRow label={"Num Guest"} error={errors.numGuest?.message}>
        <Input
          disabled={isWorking}
          type="number"
          id="numGuests"
          {...register("numGuests", {
            required: "this field is required",
            min: {
              value: 1,
              message: "Capacity should be at least one",
            },
          })}
          onChange={delayedFetchData}
        />
      </FormRow>
      <FormRow label={"Select Cabin"} error={errors.cabin?.message}>
        <SelectCabin
          disabled={loadingCabins || isWorking}
          options={cabins || []}
          value={selectedCabin}
          onChange={(e) => setSelectedCabin(e.target.value)}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" onClick={() => onClose?.()}>
          Close
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit" : "Add"} Booking
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
