export interface CropModalProps {
  open: boolean;
  image?: string;
  onSave: (b64: string) => void;
  onCloseModal:()=>void
}
