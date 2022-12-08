import React, { useState } from 'react';
import { useInput, Text, useApp } from 'ink';

export function DayInput ({ onSubmit }: { onSubmit: (day: number) => void | Promise<void> }): JSX.Element {
  const [dayNumber, setDayNumber] = useState('');

  const { exit } = useApp();

  useInput((input, key) => {
    if (key.return && dayNumber !== '') {
      void onSubmit(parseInt(dayNumber, 10));
      exit();
    } else if (key.delete || key.backspace) {
      setDayNumber(dayNumber.slice(0, dayNumber.length - 1));
    } else if (input.match(/^\d+$/) != null) {
      setDayNumber(`${dayNumber}${input}`);
    }
  });

  return <Text>Day Number: {dayNumber}</Text>;
}
