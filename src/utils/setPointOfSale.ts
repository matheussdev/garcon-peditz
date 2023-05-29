import api from "../services/api";

interface res {
  id: string;
  status: boolean;
}

export async function setPointOfSale(id: string) {
  const filteredPoint: any = await api
    .get("/api/point-of-sale")
    .then((response) => {
      return response.data.filter((point: any) => {
        return point.id === id;
      });
    });

  // const filteredPoint = points.filter((point: any) => {
  //     return point.id === id
  // })

  localStorage.setItem("@pointOfSale", filteredPoint[0].id);
  localStorage.setItem("@pointStatus", filteredPoint[0].active);
}
