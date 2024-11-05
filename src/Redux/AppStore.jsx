import { configureStore } from "@reduxjs/toolkit";
import dataSlicer from "./Slicer";

export const store = configureStore({
    reducer:{
        userData:dataSlicer
    }
});