import s from './List.module.css';
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import {
  addJoke,
  deleteJoke,
  Joke,
  requestJokes,
  requestRefreshJokes,
} from '../../redux/jokesReducer';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

type ListProps = {
  title: string
};

export const List = ({ title }: ListProps): JSX.Element => {
  const jokes = useAppSelector((state) => state.jokes.jokes);
  const favJokes = useAppSelector((state) => state.jokes.favJokes);
  const isLoading = useAppSelector((state) => state.jokes.isLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestJokes())
  }, [dispatch]);

  const finalJokes = [...favJokes, ...jokes];

  return (
    <>
      <h1 className="animate__heartBeat">{title}</h1>
      <ul className={s.jokesList}>
        {finalJokes?.length > 0 &&
          finalJokes.map((joke) => (
            <li className={s.jokesCard}>
              <div className={s.jokesContent}>
                <p className={s.jokesType}>
                  Type: <span className={s.jokesName}>{joke.type}</span>
                </p>
                <p className={s.jokesId}>ID: {joke.id}</p>
              </div>
              <h3 className={s.jokesSetup}>Setup:</h3>
              <p className={s.jokesText}>{joke.setup}</p>
              <h3 className={s.jokesPunchline}>Punchline:</h3>
              <p className={s.jokesText}>{joke.punchline}</p>
              <ul className={s.jokesBtns}>
                <li className={s.jokesBtn}>
                  <button
                    onClick={() => dispatch(deleteJoke(joke))}
                    className={s.jokesDel}
                    type="button"
                  >
                    Delete
                  </button>
                </li>
                <li className={s.jokesBtn}>
                  <button
                    onClick={() => dispatch(addJoke(joke))}
                    className={s.jokesAdd}
                    type="button"
                  >
                    Add
                  </button>
                </li>
                <li className={s.jokesBtn}>
                  <button
                    onClick={() => {
                      dispatch(deleteJoke(joke))
                      dispatch(requestRefreshJokes())
                    }}
                    className={s.jokesRefresh}
                    type="button"
                  >
                    Refresh
                  </button>
                </li>
              </ul>
            </li>
          ))}
      </ul>
      <div className={s.jokesLoad}>
        <Button
          variant="contained"
          onClick={() => dispatch(requestRefreshJokes())}
        >
          Load more
        </Button>
      </div>
    </>
  )
}
