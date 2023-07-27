import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


export interface SearchState {
  query: string;
  color: string;
}

const initialState: SearchState = {
  query: "no query!",
  color: "no color selected!",
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQueryRedux: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
    setColorRedux: (state, action: PayloadAction<any>) => {
      state.color = action.payload;
    },
  },
});

export const { setQueryRedux, setColorRedux } = searchSlice.actions;

export const selectQuery = (state: RootState) => state.search.query;
export const selectColor = (state: RootState) => state.search.color;

export default searchSlice.reducer;
