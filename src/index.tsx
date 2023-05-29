import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./styles/theme";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';

import reportWebVitals from './reportWebVitals';

import '@fontsource/roboto/400.css'
import '@fontsource/montserrat/700.css'
import { StoreProvider } from './hooks/useStore';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <ChakraProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </ChakraProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
