import { object } from "yup";
import createSchema from "../utils/validation/schema";

const useValidation = (initialValues: { [k: string]: string }) => {
  const fieldNames = Object.keys(initialValues);
  return object().shape(createSchema(fieldNames));
};

export default useValidation;
