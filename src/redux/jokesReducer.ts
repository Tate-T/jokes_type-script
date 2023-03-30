import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export type Joke = {
  id: number
  type: string
  setup: string
  punchline: string
};

type JokesState = {
  favJokes: Joke[]
  jokes: Joke[]
  isLoading: boolean
};

export const requestJokes = createAsyncThunk(
  'jokes/get',
  async (_, thunkApi) => {
    const { data } = await axios.get<Joke[]>(
      'https://official-joke-api.appspot.com/jokes/ten',
    )
    return data
  },
);

export const requestRefreshJokes = createAsyncThunk(
  'jokes/refresh',
  async (_, thunkApi) => {
    const { data } = await axios.get<Joke[]>(
      'https://official-joke-api.appspot.com/jokes/ten',
    )
    const jokes = (thunkApi.getState() as RootState).jokes.jokes as Joke[]
    const jokesIds = jokes.map((joke) => joke.id) //['1' ,'2', '3'] -> {id: '3', ...}
    const hasDublicates = !data.every(
      (newJoke: Joke) => !jokesIds.includes(newJoke.id),
    )

    if (hasDublicates) {
      thunkApi.dispatch(requestRefreshJokes())
      return thunkApi.rejectWithValue(false)
    }

    return data
  },
);

const initialState: JokesState = {
  jokes: [],
  favJokes: [],
  isLoading: false,
};

const jokesSlice = createSlice({
  name: 'jokes',
  initialState,
  reducers: {
    addJoke: (state, { payload }: PayloadAction<Joke>) => {
      state.favJokes = [...state.favJokes, payload]
    },
    deleteJoke: (state, { payload }: PayloadAction<Joke>) => {
      state.favJokes = state.favJokes.filter((joke) => joke.id !== payload.id)
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(requestJokes.pending, (state) => {
        state.isLoading = true
      })
      .addCase(
        requestJokes.fulfilled,
        (state, action: PayloadAction<Joke[]>) => {
          state.isLoading = false
          state.jokes = action.payload
        },
      )
      .addCase(
        requestRefreshJokes.fulfilled,
        (state, action: PayloadAction<Joke[]>) => {
          state.isLoading = false
          state.jokes = [...state.jokes, ...action.payload]
        },
      ),
});

export const { addJoke, deleteJoke } = jokesSlice.actions;
export default jokesSlice.reducer;
