import { Page } from './components/Page';
import { ListData } from './contexts/list-data-context';

function App() {

  return (
    <ListData>
      <Page />
    </ListData>
  )
}

export default App
