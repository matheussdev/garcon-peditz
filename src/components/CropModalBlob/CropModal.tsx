import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Flex,
  Input,
  Spinner,
} from "@chakra-ui/react";

import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import { CropModalProps } from "./CropModal.types";

import getCroppedImg from "./crop";
import {
  HiCamera,
  HiOutlineZoomIn,
} from "react-icons/hi";

export function CropModal({
  open,
  image,
  onSave,
  onCloseModal,
}: CropModalProps) {
  const [imageSrc, setImageSrc] = useState(image);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [load, setLoad] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc as string,
        croppedAreaPixels,
        rotation
      );
      onSave(croppedImage as Blob);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation, onSave]);

  // const onClose = useCallback(() => {
  //   setCroppedImage(null);
  // }, []);

  const onFileChange = async (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };
  async function handleSave() {
    setLoad(true);
    showCroppedImage()
      .then(() => {
        setLoad(false);
        onCloseModal();
      })
      .catch(() => {
        setLoad(false);
      }).finally(()=>{
        setLoad(false);
      });
  }

  return (
    <Modal onClose={() => onCloseModal()} size="xl" isOpen={open}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Escolha uma foto para o seu produto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <>
            {imageSrc && (
              <Box
                position="relative"
                width="100%"
                height={200}
                background="#333"
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  rotation={rotation}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </Box>
            )}
            <Slider
              aria-label="slider-ex-4"
              value={zoom}
              min={1}
              max={3}
              step={0.01}
              onChange={(zoom: number) => setZoom(zoom)}
              mt="4"
            >
              <SliderTrack bg="red.100">
                <SliderFilledTrack bg="tomato" />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="tomato" as={HiOutlineZoomIn} />
              </SliderThumb>
            </Slider>
          </>
          <Flex>
            <Button
              mx="auto"
              colorScheme={"blue"}
              leftIcon={<HiCamera />}
              position={"relative"}
            >
              Escolher foto
              <Input
                type="file"
                onChange={onFileChange}
                accept="image/*"
                position={"absolute"}
                width={"100%"}
                height={"100%"}
                opacity={0}
              />
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter mt={10}>
          <Button
            onClick={() => {
              onCloseModal();
            }}
            colorScheme="red"
            mr="auto"
          >
            Cancelar
          </Button>{" "}
          <Button
            onClick={() => handleSave()}
            disabled={load}
            colorScheme={"green"}
          >
            {load ? <Spinner size="md" /> : "Salvar"}
          </Button>{" "}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
