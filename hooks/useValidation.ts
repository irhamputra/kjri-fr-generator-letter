import { object } from "yup";
import createSchema from "../utils/validation/schema";

const useValidation = (initialValues: { [k: string]: string }) => {
  return object().shape(createSchema(initialValues));
};

export default useValidation;
