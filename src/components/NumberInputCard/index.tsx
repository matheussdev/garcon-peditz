import { useState } from "react";
import { Flex, Button, Input } from "@chakra-ui/react";

interface NumberInputCardProps {
  initialValue: number;
}

export function NumberInputCard({ initialValue }: NumberInputCardProps) {
  const [value, setValue] = useState(initialValue);

  function decreaseValue() {
    setValue(value - 1);
  }

  function increaseValue() {
    setValue(value + 1);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = parseInt(event.target.value);

    if (!isNaN(newValue)) {
      setValue(newValue);
    }
  }

  return (
    <Flex alignItems="center">
      <Button onClick={decreaseValue}>-</Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        textAlign="center"
        width="50px"
        mr={2}
        ml={2}
      />
      <Button onClick={increaseValue}>+</Button>
    </Flex>
  );
}
