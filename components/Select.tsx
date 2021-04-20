import { ActionMeta, components, SingleValueProps } from "react-select";
import Select from "react-select";
import useQueryArsip from "../hooks/query/useQueryArsip";
import { SelectComponentsProps } from "react-select/src/Select";

type OptionsValue = {
  value: {
    acronym: string;
  };
};

const SelectArsip = ({
  placeholder,
  onChange = () => {},
  value,
  isDisabled,
  ...rest
}: SelectComponentsProps): JSX.Element => {
  // reconstruct option from value
  const { data: listArsip, isLoading: isLoadingArsip } = useQueryArsip();

  const options = isLoadingArsip
    ? []
    : listArsip.map(({ acronym, ...rest }: { acronym: string }) => ({
        label: acronym,
        value: ({ acronym, ...rest } as unknown) as string,
      }));

  const handleOnChange = (option: { value: { acronym: string } }, { action }: ActionMeta<any>) => {
    if (action === "select-option") {
      onChange(option?.value?.acronym);
    }

    if (action === "clear") {
      onChange("");
    }
  };

  const SingleValue = (props: SingleValueProps<any>) => {
    const { jenisArsip } = props?.data?.value;

    return (
      <components.SingleValue {...props}>
        <div>
          <div>{props.children}</div>
          <div style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.6)" }}>{`${jenisArsip}`}</div>
        </div>
      </components.SingleValue>
    );
  };

  const [usedValue] = options.filter((opt: OptionsValue) => opt.value.acronym === value);

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
