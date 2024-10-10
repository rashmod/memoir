import { useState, useEffect } from 'react';

import { Input, InputProps } from '@/components/ui/input';

export default function DebouncedInput({
  value: initialValue,
  handleChange,
  debounce = 500,
  ...props
}: { value: string | number; debounce?: number; handleChange: (value: string | number) => void } & InputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value]);

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
