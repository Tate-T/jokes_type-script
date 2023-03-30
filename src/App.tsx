import Container from './components/Container/Container';
import { List } from './components/List/List';

import './App.css';

const App = (): JSX.Element => {
  return (
    <Container>
      <List title={'Jokes'} />
    </Container>
  )
};

export default App;
