import './App.css';
import { Page } from './components/Page';
import { ListData } from './list-data-context';

function App() {

  return (
    <ListData>
      <Page />
    </ListData>
  )
}

export default App
