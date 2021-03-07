import { object } from "yup";
import createSchema from "../utils/validation/schema";

const useValidation = (key: string[]) => {
  return object().shape(createSchema(key));
};

export default useValidation;
