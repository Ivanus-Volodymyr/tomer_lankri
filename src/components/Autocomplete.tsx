import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Option } from "../types/autocomplete";
import {
  Autocomplete as AutocompleteInput,
  Chip,
  TextField,
} from "@mui/material";
import { useAutocompleteStore } from "../store/autocomplete";

const Autocomplete = () => {
  const {
    data: options,
    isLoading,
    isSuccess,
  } = useQuery<Option[]>({
    queryKey: ["autocompleteOptions"],
    queryFn: async () => {
      const response = await fetch(
        "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete",
      );
      return await response.json();
    },
  });

  const operands = ["+", "-", "*", "(", ")", "^", "/"];

  const fullInputValues = useAutocompleteStore(
    (state) => state.fullInputValues,
  );
  const addFullInputValue = useAutocompleteStore(
    (state) => state.addFullInputValue,
  );
  const removeLastFullInputValue = useAutocompleteStore(
    (state) => state.removeLastFullInputValue,
  );
  const clearLastFullInputValues = useAutocompleteStore(
    (state) => state.clearLastFullInputValues,
  );

  const currentInput = useAutocompleteStore((state) => state.currentInput);
  const setCurrentInput = useAutocompleteStore(
    (state) => state.setCurrentInput,
  );

  const uniqueOptions = options?.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id),
  );

  const calculateValue = () => {
    try {
      return eval(fullInputValues.map((item) => item.value).join(""));
    } catch (error) {
      return "";
    }
  };

  const selectChangeHandler = (
    event: React.ChangeEvent<{}>,
    values: Option[],
    reason: string,
  ) => {
    if (reason === "clear") {
      return clearLastFullInputValues();
    }
    if (reason === "removeOption") {
      return removeLastFullInputValue();
    }
    const option = values[values.length - 1];
    if (option) {
      addFullInputValue(option);
    }
  };

  const inputChangeHandler = (
    event: React.SyntheticEvent<Element, Event>,
    string: string,
  ) => {
    if (operands.includes(string)) {
      const operand = {
        id: Math.random().toString(),
        name: string,
        category: "operand",
        value: string,
      };
      if (operand) {
        addFullInputValue(operand);
        return setCurrentInput("");
      }
    }
    setCurrentInput(string);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="autocomplete-container">
      {isSuccess && uniqueOptions && (
        <div className="autocomplete-math-box">
          <AutocompleteInput
            className="autocomplete-input"
            onInputChange={inputChangeHandler}
            multiple
            value={fullInputValues}
            filterSelectedOptions={true}
            options={uniqueOptions}
            inputValue={currentInput}
            getOptionKey={(option) => option.id}
            renderOption={(props, option) => {
              const { key, ...rest } = props as Record<string, any>;
              return (
                <li
                  key={key}
                  {...rest}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {option.name}
                  <span style={{ fontFamily: "fantasy", fontSize: "10px" }}>
                    {option.category}
                  </span>
                </li>
              );
            }}
            onChange={selectChangeHandler}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" hiddenLabel />
            )}
            getOptionLabel={(option) => (option.name ? option.name : "")}
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <>
                  {option.category !== "operand" ? (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.name}
                    />
                  ) : (
                    <span className="operand" key={option.id}>
                      {option.value}
                    </span>
                  )}
                </>
              ));
            }}
          />
          <div className="result">
            <span>=</span>
            {calculateValue()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
