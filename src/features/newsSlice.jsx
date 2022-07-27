import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    newList: [],
    loading: true,
};

//? State'lerin API gibi async kaynaklardan gelen verilere gore guncellenmesi gerekebilir.
//? Ancak boyle bir durumda async islem tamamlandiktan sonra state guncellenmelidir.
//? Gonderilen api istegi ile dogrudan state guncellememelidir.
//? Islemin tamamlanmasi ile gelen veriye gore state'in guncellenemsini saglamak
//? adina bir arabirim kullanilmaktadir.
//? Bu arabirim middleware denilir.Redux-Toolkit, default olarak Thunk kullanmaktadir.
//! Thunk'ın amaci reducers'a islenmis sonuclari gondermeden once gecikmeli asenkron ismlerinin yurutulmesini saglamaktir.

const API_KEY = process.env.REACT_APP_API_KEY;

export const getNews = createAsyncThunk(
  'news/getNews', //! action type ismi

  //! async callback fun.
  async () => {
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en`;
    try {
      const { data } = await axios(url);
      console.log(data);
      return data.results;
      
    } catch (error) {
      console.log(error);
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearNewsList: (state) => {
      state.newsList = [];
    },
  },
  extraReducers: {
    [getNews.pending]: (state, action) => {
      state.loading = true;
    },
    [getNews.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.newsList = payload;
    },
    [getNews.rejected]: (state) => {
      state.loading = false;
    },
  },
});

//! baska slice'lardaki tanimlanan action'lara cevap vermek
//! bilhassa createAsyncThunk tarafindan olusturulan action'lara
//! cevap vermek icin kullanilir.

export const { clearNewsList } = newsSlice.actions;

export default newsSlice.reducer;