export interface EditarMesaModalProps {
  open: boolean;
  onCloseModal: () => void;
  pointId: string;
  update: () => void;
  table:
    | {
        id: string;
        name: string;
        number: number;
      }
    | undefined;
}
