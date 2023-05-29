export interface CropModalProps {
  open: boolean;
  image?: string;
  onSave: (b64: Blob) => void;
  onCloseModal:()=>void
}
