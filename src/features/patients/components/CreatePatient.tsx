
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { FaCheck, FaExclamationCircle, FaUserFriends } from "react-icons/fa";
import {
  Button,
  TextInput,
  MultiSelect,
  Stack,
  NumberInput,
  Modal,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCreatePatient } from "../api/create-patient";
import { IPatientDTO } from "../model/IPatient";

import { useGetDiseases1} from "../../diseases/api/get-all-diseases";
import { useGetDoctors } from "../../doctors/api/get-all-doctors";
import {BaseTypeForPagination} from '../../utilForFeatures/basePropForPagination';
import { notifications } from "@mantine/notifications";


const CreatePatient: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IPatientDTO>({
    defaultValues: {
      name: "",
      age: 0,
      diseases: [],
      doctors: [],
    },
  });

  const mutation = useCreatePatient(() => {
    close();
    reset();
  });

  const defaultQuery: BaseTypeForPagination = {
    page: 1,
    limit: 100,
  };

  const {
    data: diseases,
    error: diseaseError,
    isLoading: diseaseIsLoading,
  } = useGetDiseases1(defaultQuery);


  const {
    data: doctors = [],
    error: doctorError,
    isLoading: doctorIsLoading,
  } = useGetDoctors();

  const onSubmit = (data: IPatientDTO) => {
    mutation.mutate(data,{
      onSuccess: () =>{
        notifications.show({            
          title: 'Success',
          message: 'Disease saved successfully :',
          color: 'green',
          autoClose: 3000,
          icon: <FaCheck size={20} />,                        
          withCloseButton: true,          
        })
      },
      onError: () =>{
        notifications.show({            
          title: 'Fail',
          message: 'Disease not saved successfully',
          color: 'red',
          autoClose: 3000,
          icon: <FaExclamationCircle  size={20} />,                        
          withCloseButton: true,
        })
      }
    });
  };

  const [opened, { open, close }] = useDisclosure(false);

  
  if (diseaseIsLoading || doctorIsLoading)
    return <div>Loading...</div>;
  if (diseaseError || doctorError) return <div>Error</div>;


  const diseaseOptions = diseases?.data?.map((disease) => ({ 
        value: disease._id, 
        label: disease.name 
    })) || [];


    const doctorOptions = doctors?.map((doctor) => ({ 
      value: doctor._id, 
      label: doctor.name 
  })) || [];

  
  return (
    <>
      <Modal opened={opened} onClose={close} title="New Patient">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing="md">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextInput
                  label="Name"
                  placeholder="Enter patient name"
                  {...field}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              name="age"
              control={control}
              rules={{ required: "Age is required", min: 1 }}
              render={({ field }) => (
                <NumberInput
                  label="Age"
                  placeholder="Enter patient age"
                  {...field}
                  error={
                    errors.age
                      ? "Age is required and must be a positive number"
                      : null
                  }
                />
              )}
            />

            <Controller
              name="diseases"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  data={diseaseOptions}
                  label="Diseases"
                  placeholder="Select diseases"
                  value={field.value}
                  onChange={(values) => field.onChange(values)}
                  error={
                    errors.diseases && "Please select at least one disease"
                  }
                />
              )}
            />

            <Controller
              name="doctors"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  data={doctorOptions}
                  label="Doctors"
                  placeholder="Select doctors"
                  value={field.value}
                  onChange={(values) => field.onChange(values)}
                  error={errors.doctors && "Please select at least one doctor"}
                />
              )}
            />

            <div className="flex flex-row gap-6 justify-end">
              <Button onClick={close} disabled={mutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader size="sm" color="white" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Stack>
        </form>
      </Modal>

      <Stack align="center">
        <Button onClick={open} leftIcon={<FaUserFriends size={18} />}>
          New Patient
        </Button>
      </Stack>
    </>
  );
};

export default CreatePatient;
