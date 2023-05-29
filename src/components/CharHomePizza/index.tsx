import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import "./chart.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  // plugins: {
  //   legend: {
  //     position: "right",
  //   },
  //   title: {
  //     display: true,
  //     text: "Categoria de produtos mais vendidos",
  //   },
  // },
};

const labels = ["Entradas", "bebidas", "sobremesas"];

export const data = {
  labels,
  datasets: [
    {
      label: "Visitas",
      data: [100, 200, 300],
      borderColor: ["#7F5AD5", "#DD6A1F", "#2FAA53"],
      backgroundColor: [
        "rgb(127, 90, 213, 0.6)",
        "rgb(221, 106, 31, 0.6)",
        "rgb(47, 170, 83, 0.6 )",
      ],
    },
  ],
};

export function CharHomePizza() {
  return (
    <div style={{ width: "350px" }}>
      {/* <Pie className="chart" options={options} data={data} /> */}
    </div>
  );
}
