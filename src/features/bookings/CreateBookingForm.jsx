import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import Textarea from "../../ui/Textarea";
import Spinner from "../../ui/Spinner";

import { useForm } from "react-hook-form";
import { useCabins } from "../cabins/useCabins";
import { useSettings } from "../settings/useSettings";
import { useCreateBooking } from "./useCreateBooking";
import { forwardRef, useEffect, useImperativeHandle } from "react";

const countries = [
  { nationality: "United States", countryCode: "US" },
  { nationality: "China", countryCode: "CN" },
  { nationality: "United Kingdom", countryCode: "GB" },
  { nationality: "Germany", countryCode: "DE" },
  { nationality: "India", countryCode: "IN" },
  { nationality: "Japan", countryCode: "JP" },
  { nationality: "Australia", countryCode: "AU" },
];

const CreateBookingForm = forwardRef(function CreateBookingForm(
  { onCloseModal, onFormStateChange },
  ref
) {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors, isDirty } = formState;

  const { isCreating, createBooking } = useCreateBooking();
  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const { settings, isLoading: isLoadingSettings } = useSettings();

  useImperativeHandle(ref, () => ({
    resetForm: reset,
  }));

  useEffect(
    function () {
      onFormStateChange?.(isDirty);
    },
    [isDirty, onFormStateChange]
  );

  if (isLoadingCabins || isLoadingSettings) return <Spinner />;

  function onSubmit(data) {
    const numNights = Math.round(
      (new Date(data.endDate) - new Date(data.startDate)) /
        (1000 * 60 * 60 * 24)
    );

    const selectedCabin = cabins.find(
      (cabin) => cabin.id === Number(data.cabinId)
    );
    const cabinPrice =
      (selectedCabin.regularPrice - selectedCabin.discount) * numNights;
    const extrasPrice = data.hasBreakfast
      ? settings.breakfastPrice * numNights * data.numGuests
      : 0;
    const totalPrice = cabinPrice + extrasPrice;

    const finalData = {
      guestData: {
        fullName: data.fullName,
        email: data.email,
        nationality: countries.find((c) => c.countryCode === data.countryCode)
          ?.nationality,
        countryCode: data.countryCode,
        nationalID: data.nationalID,
      },
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      numNights,
      numGuests: Number(data.numGuests),
      cabinPrice,
      extrasPrice,
      totalPrice,
      hasBreakfast: data.hasBreakfast,
      isPaid: data.isPaid,
      observations: data.observations,
      cabinId: Number(data.cabinId),
      status: "unconfirmed",
    };

    createBooking(finalData, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    });
  }

  function onError(errors) {
    console.error("Form validation failed:", errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Full Name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isCreating}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isCreating}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address.",
            },
          })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.countryCode?.message}>
        <select
          id="countryCode"
          disabled={isCreating}
          {...register("countryCode", { required: "This field is required" })}
          style={{
            width: "100%",
            padding: "0.8rem 1.2rem",
            border: "1px solid var(--color-grey-300)",
            borderRadius: "var(--border-radius-sm)",
          }}
        >
          <option value="">Select nationality...</option>
          {countries.map((c) => (
            <option key={c.countryCode} value={c.countryCode}>
              {c.nationality}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow label="National ID" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isCreating}
          {...register("nationalID", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          disabled={isCreating}
          {...register("startDate", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          disabled={isCreating}
          {...register("endDate", {
            required: "This field is required",
            validate: (value) =>
              getValues().startDate < value ||
              "End date must be after start date.",
          })}
        />
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          disabled={isCreating}
          {...register("numGuests", {
            required: "This field is required",
            min: { value: 1, message: "Must be at least 1 guest" },
          })}
        />
      </FormRow>

      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <select
          id="cabinId"
          disabled={isCreating}
          {...register("cabinId", { required: "This field is required" })}
          style={{
            width: "100%",
            padding: "0.8rem 1.2rem",
            border: "1px solid var(--color-grey-300)",
            borderRadius: "var(--border-radius-sm)",
          }}
        >
          <option value="">Select a cabin...</option>
          {cabins.map((cabin) => (
            <option value={cabin.id} key={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow label="Observations">
        <Textarea
          id="observations"
          disabled={isCreating}
          {...register("observations")}
        />
      </FormRow>

      <FormRow>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            type="checkbox"
            id="hasBreakfast"
            disabled={isCreating}
            {...register("hasBreakfast")}
          />
          <label htmlFor="hasBreakfast">Breakfast?</label>
        </div>
      </FormRow>

      <FormRow>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            type="checkbox"
            id="isPaid"
            disabled={isCreating}
            {...register("isPaid")}
          />
          <label htmlFor="isPaid">Paid?</label>
        </div>
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>Create new booking</Button>
      </FormRow>
    </Form>
  );
});

export default CreateBookingForm;
