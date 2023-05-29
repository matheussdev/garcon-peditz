import { ReactNode, RefObject, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils";
interface ConfirmModalProps {
  title?: string;
  isOpen: boolean;
  body?: ReactNode;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onLoad?: boolean;
  buttonTitle?: string;
  buttonColor?: string;
}
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  body,
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  onLoad = false,
  buttonTitle = "Apagar",
  buttonColor = "red",
}) => {
  const cancelRef = useRef();
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef as unknown as RefObject<FocusableElement>}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              isLoading={onLoad}
              ref={cancelRef as unknown as undefined}
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              isLoading={onLoad}
              colorScheme={buttonColor}
              onClick={onConfirm}
              ml={3}
            >
              {buttonTitle}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
