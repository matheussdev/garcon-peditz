import { Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';
import "./style.css";

registerLocale('pt-BR', ptBR);

export const DatePickerRangeInput: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [datesSelected, setDatesSelected] = useState(false);

  const handleDateChange = (date: Date | null) => {
    if (!startDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate && date && date >= startDate) {
      setEndDate(date);
      setDatesSelected(true);
    } else {
      setEndDate(null);
      setDatesSelected(false);
    }
  };

  const today = new Date();

  return (
    <>
      <Flex flexDirection="column" w="100%">
        <Text>Data de validade do voucher:</Text>
        <Flex gap={4} mt={2} w="100%">
          <Flex flexDirection="column" width="50%">
            <Text fontSize="0.8rem" ml="0.6rem">Data de início</Text>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              selected={startDate}
              onChange={handleDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={today}
              shouldCloseOnSelect={false}
              placeholderText="Selecione"
              className="custom-datapicker"
            />
          </Flex>
          <Flex flexDirection="column" width="50%">
            <Text fontSize="0.8rem" ml="0.6rem">Data de expiração</Text>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              selected={endDate}
              onChange={handleDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="Selecione"
              className="custom-datapicker"
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
