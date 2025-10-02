import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { createCabin } from "../../services/apiCabins";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow"; // 确保已导入重构后的 FormRow 组件
import { useEffect } from "react";

function CreateCabinForm({ cabinToEdit = {} }) {
  console.log("Received cabinToEdit:", cabinToEdit);

  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
    shouldUnregister: false,
  });
  const { errors } = formState;

  useEffect(
    function () {
      if (isEditSession) {
        console.log("VALUES TO BE SET IN FORM:", editValues);

        reset(editValues);
      }
    },
    [isEditSession, editValues, reset]
  );

  const queryClient = useQueryClient();

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  // react-hook-form 会处理错误，我们只需要提交数据
  function onSubmit(data) {
    // 将 data.image FileList 转换为单个文件
    mutate({ ...data, image: data.image[0] });
  }

  return (
    // ✅ handleSubmit 会自动处理错误，无需再传递 onError
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* ✅ 正确的使用模式:
        1. 使用 <FormRow> 包裹
        2. 通过 `label` prop 传递标签文本
        3. 通过 `error` prop 传递错误信息
        4. 将 <Input /> 或其他表单元素作为 `children` 传入
      */}
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isCreating}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreating}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isCreating}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Price should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isCreating}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              // getValues() 获取表单中所有当前值
              Number(value) <= Number(getValues().regularPrice) ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          id="description"
          disabled={isCreating}
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        {/* 为 Cancel 按钮添加 onClick 事件来重置表单 */}
        <Button variation="secondary" type="reset" onClick={() => reset()}>
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {isEditSession ? "Edit cabin" : "Create newcabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
