import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef} from "react";
import {validateOnchange} from "../helpers/validateOnchange";
import set from "lodash/set"
import {PropertyPath} from "lodash"

interface IUseFormHandlers<T> {
  initialValue: T;
  onSubmit: (value: T | any) => void;
  validators?: Partial<{
    [K in keyof T]: (val: T[K], prev: T) => Partial<T>
  }>,
  onDone?: boolean | undefined
}

export function useFormHandlers<T extends object>({initialValue, onSubmit, validators, onDone}: IUseFormHandlers<T>) {
  console.log('useFormHandlers')
  const [values, setValues] = React.useState<T>(initialValue);
  // console.log(' useForm values: ', values)
  // console.log(' useForm initialVaue: ', initialValue)
  useEffect(() => {
    if (onDone !== undefined && onDone) {
      setValues(initialValue);
    }
  }, [onDone]);
  useEffect(() => {
    setValues(initialValue)
  }, [initialValue]);
  const getCacheHandler = useRef(new Map<keyof T, (date: Date | null) => void>())
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const {name, value, type} = e.target;
    setValues(prev => {
      const updated = structuredClone(prev);
      let newValue: any = value
      if (type === "number") {
        if (/^[1-9]\d*$/.test(value) || value === '') {
          newValue = value === "" ? "" : Number(value);
        } else {
          return prev;
        }
      }
      if (Array.isArray(newValue) && newValue.length === 1 && Array.isArray(newValue[0])) {
        newValue = newValue[0];
      }
      set(updated as T, name as PropertyPath, newValue);
      return updated
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
  const memoValues = useMemo(() => values, [values])
  return {handleChange, memoHandleDateChange, handleSubmit, values: memoValues, setValues};
}