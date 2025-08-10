import React, {ChangeEvent, useCallback, useEffect, useRef} from "react";
import {validateOnchange} from "../helpers/validateOnchange";

interface IUseFormHandlers<T> {
  initialValue: T;
  onSubmit: (value: T | any) => void;
  validators?: Partial<{
    [K in keyof T]: (val: T[K], prev: T) => Partial<T>
  }>,
  onDone?: boolean | undefined
}

export function useFormHandlers<T>({initialValue, onSubmit, validators, onDone}: IUseFormHandlers<T>) {
  const [values, setValues] = React.useState<T>(initialValue);
  useEffect(() => {
    if (onDone !== undefined && onDone) {
      setValues(initialValue);
    }
  }, [initialValue, onDone]);
  const getCacheHandler = useRef(new Map<keyof T, (date: Date | null) => void>())
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const {name, value, type} = e.target;
    setValues(prev => {
      if (type === "number") {
        if (/^[1-9]\d*$/.test(value) || value === '') {
          return {
            ...prev,
            [name]: value,
          };
        }
        return prev;
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  }, [])
  const handleDateChange = useCallback((field: keyof typeof values, date: Date | null) => {
    setValues((prev) => {
      const prevDate = prev[field] as Date | null;
      const areSame = prevDate instanceof Date &&
        date instanceof Date &&
        prevDate.getDate() === date.getDate() &&
        prevDate?.getTime() === date?.getTime();
      if (areSame) return prev
      let updated = {...prev, [field]: date}
      const validation = validateOnchange?.(field, date, prev, validators)
      updated = {...updated, [field]: date, ...validation}
      return updated
    })
  }, [validators])
  const memoHandleDateChange = useCallback((field: keyof T) => {
    const existing = getCacheHandler.current.get(field)
    if (existing !== undefined && existing) return existing
    const handler = (date: Date | null) => {
      handleDateChange(field, date);
    }
    getCacheHandler.current.set(field, handler)
    return handler
  }, [handleDateChange])

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(values);
  }, [onSubmit, values]);
  return {handleChange, memoHandleDateChange, handleSubmit, values, setValues};
}