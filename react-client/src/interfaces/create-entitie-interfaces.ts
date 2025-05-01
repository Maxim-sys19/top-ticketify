export interface IEditEntityProps<T> {
  show: boolean;
  onClose: () => void;
  entity: T | undefined;
}