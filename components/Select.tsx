import { components } from "react-select";
import Select from "react-select";
import useQueryArsip from "../hooks/query/useQueryArsip";
import { SelectComponentsProps } from "react-select/src/Select";

const SelectArsip: React.FC<SelectComponentsProps> = ({
  placeholder,
  onChange = () => {},
  value,
  isDisabled,
  ...rest
}) => {
  // reconstruct option from value
  const { data: listArsip, isLoading: isLoadingArsip } = useQueryArsip();

  const options = isLoadingArsip
    ? []
    : listArsip.map(({ acronym, ...rest }) => ({
        label: acronym,
        value: ({ acronym, ...rest } as unknown) as string,
      }));

  const handleOnChange = (option, { action }) => {
    if (action === "select-option") {
      onChange(option?.value?.acronym);
    }

    if (action === "clear") {
      onChange("");
    }
  };

  const SingleValue = (props) => {
    const { jenisArsip } = props?.data?.value;
    return (
      <components.SingleValue {...props}>
        <div>
          <div>{props.children}</div>
          <div style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.6)" }}>
            {`${jenisArsip}`}
          </div>
        </div>
      </components.SingleValue>
    );
  };

  const usedValue = options.filter(
    ({ value: { acronym } }) => acronym === value
  )[0];

  return (
    <Select
      components={{ SingleValue }}
      placeholder={placeholder}
      onChange={handleOnChange}
      value={usedValue}
      styles={{ control: (provided) => ({ ...provided, height: 66 }) }}
      options={options}
      isDisabled={isDisabled}
      {...rest}
    />
  );
};

export { SelectArsip };
