import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "./features/studentsSlice";
import visitorReducer from "./features/visitorThunks"; 

const store = configureStore({
  reducer: {
    students: studentReducer,
    visitors: visitorReducer, 
  },
});

export default store;