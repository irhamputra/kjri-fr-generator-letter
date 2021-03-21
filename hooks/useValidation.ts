import { object } from "yup";
import createSchema from "../utils/validation/schema";

const useValidation = <T>(initialValues: T) => {
  return object().shape(createSchema<T>(initialValues));
};

export default useValidation;
