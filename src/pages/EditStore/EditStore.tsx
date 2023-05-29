import { useMediaQuery, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StoreBio } from "./Components/StoreBio";
import { Address } from "./Components/Address";
import { Schedule } from "./Components/Schedule";
import api from "../../services/api";
import { logout } from "../../services/auth";

interface scheduleProps {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface adressProps {
  complement: string;
  district: string;
  id: string;
  latitude: string;
  longitude: string;
  number: string;
  road: string;
  zipCode: string;
  city: {
    name: string;
  };
  state: {
    initials: string;
  };
}
interface storeProps {
  image: string;
  openPointOfSale: boolean;
  id: string;
  name: string;
  whatsapp: string;
  slug: string;
  instagram: string;
  description: string;
  schedules: scheduleProps;
  address: adressProps;
  category: { id: string; categoryName: string };
}

export function EditStore() {
  const [isLargerThan1000] = useMediaQuery([
    "(min-width: 1000px)",
    "(max-width: 600px)",
  ]);

  const [store, setStore] = useState<storeProps>();

  const { id } = useParams();

  useEffect(() => {
    api
      .get(`api/point-of-sale/${id}`)
      .then((response) => {
        setStore(response.data);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
          if (err.response.data.statusCode === 401) {
            logout();
          }
        }
      });
  }, [id]);

  return (
    <>
      <Grid gridTemplateColumns={isLargerThan1000 ? "1fr" : "1fr"} gap={4}>
        <StoreBio store={store} />
        <Address address={store?.address} pId={store?.id} />
        <Schedule schedule={store?.schedules} pId={store?.id} />
      </Grid>
    </>
  );
}
