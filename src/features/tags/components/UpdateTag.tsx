import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, Stack, Modal } from "@mantine/core";
import { useUpdateTag } from "../api/update-tag";
import { ITag } from "../model/ITag";
import { notifications } from "@mantine/notifications";
import { FaEdit, FaExclamationCircle } from "react-icons/fa";

interface UpdateTagProps {
  tag: ITag;
  closeModal: () => void;
}

export const UpdateTag: React.FC<UpdateTagProps> = ({
  tag,
  closeModal,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ITag>({
    defaultValues: {
      ...tag,
    },
  });

  const mutation = useUpdateTag();

  const onSubmit = (data: ITag) => {
    const transformedData = {
      ...data,
    };
    mutation.mutate(transformedData, {
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Tag updated successfully",
          color: "green",
          autoClose: 3000,
          icon: <FaEdit size={20} />,
          withCloseButton: true,
        });
        closeModal();
      },
      onError: (error) => {
        console.error("Failed to update Tag", error);
        notifications.show({
          title: "Fail",
          message: "Tag not saved successfully",
          color: "red",
          autoClose: 3000,
          icon: <FaExclamationCircle size={20} />,
          withCloseButton: true,
        });
        closeModal();
      },
    });
  };

  useEffect(() => {
    reset(tag);
  }, [tag, reset]);

  return (
    <Modal opened={true} onClose={closeModal} title="Edit Tag">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextInput
                label="Name"
                placeholder="Enter tag name"
                {...field}
                error={errors.name?.message}
              />
            )}
          />

          <div className="flex flex-row gap-6 justify-end">
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
};
