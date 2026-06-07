import {Field} from "../../Form/FormFieldTypes";

const findChildArray = (selected: any, child: Field): any[] => {
  if (!selected) return [];
  const selectedObj = Array.isArray(selected) ? selected[0] : selected;
  const segments = child.name.split('.');
  const candidate = segments.at(-2)?.replace(/\[\d+]/, '');
  if (Array.isArray(selectedObj?.[candidate!])) return selectedObj[candidate!];
  const last = segments.at(-1);
  const guess = last?.replace(/Id(s)?$/i, 's');
  if (Array.isArray(selectedObj?.[guess!])) return selectedObj[guess!];
  const foundKey = Object.keys(selectedObj).find((k) => {
    const v = selectedObj[k];
    return (
      Array.isArray(v) &&
      v.length > 0 &&
      typeof v[0] === 'object' &&
      'id' in v[0] &&
      ('name' in v[0] || 'title' in v[0])
    );
  });
  if (foundKey) return selectedObj[foundKey];
  return [];
};
const getValueAtPath = (name: string, rootValue: any): any => {
  const paths = name
    .replace(/\[(\d+)]/g, '.$1')
    .split('.');
  return paths.reduce((acc: any, key) => {
    return (acc ? acc[key] : undefined)
  }, rootValue);
};

export {findChildArray, getValueAtPath}