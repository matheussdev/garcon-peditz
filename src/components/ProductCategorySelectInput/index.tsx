import { Input } from "@chakra-ui/react";
import React, { useState } from "react";
import Select, { AriaOnFocus, GroupBase } from "react-select";
import { ProductCategory } from "../../types";
interface ProductCategorySelectInputProps {
  categoriesList: ProductCategory[];
  onChange: (event: string | undefined)=> void;
  value: string;
}
export const ProductCategorySelectInput: React.FC<
  ProductCategorySelectInputProps
> = ({ categoriesList, onChange, value }) => {

  const onFocus: AriaOnFocus<{ label: string; value: string }> = ({
    focused,
    isDisabled,
  }) => {
    const msg = `You are currently focused on option ${focused.label}${
      isDisabled ? ", disabled" : ""
    }`;
    return msg;
  };
  const onMenuOpen = () => {};
  const onMenuClose = () => {};
  const [categoryMenuIsOpen, setCategoryMenuIsOpen] = useState(false);

  const handleChange = (event: string | undefined) => {
    onChange(event)
    setCategoryMenuIsOpen(false);
  };
  const handleChangeInput = (event: string | undefined) => {
    onChange(event)
  };
  return (
    <div style={{ position: "relative" }}>
      <Select
        aria-labelledby="aria-label"
        ariaLiveMessages={{
          onFocus,
        }}
        menuIsOpen={categoryMenuIsOpen}
        onChange={(event) => handleChange(event?.value)}
        inputId="aria-example-input"
        name="aria-live-color"
        inputValue={value}
        placeholder=""
        noOptionsMessage={(obj: { inputValue: string }) =>
          "Digite para criar uma nova categoria"
        }
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        options={
          categoriesList.map((a) => ({
            value: a.title,
            label: a.title,
          })) as unknown as readonly (
            | { label: string; value: string }
            | GroupBase<{ label: string; value: string }>
          )[]
        }
      />
      <Input
        autoComplete="none"
        required
        pos={"absolute"}
        top={0}
        bg="white"
        value={value}
        onBlur={() => setTimeout(() => setCategoryMenuIsOpen(false), 100)}
        onFocus={() => setCategoryMenuIsOpen(true)}
        onChange={(event) =>handleChangeInput(event.target.value)}
      />
    </div>
  );
};
