import { Page } from "./components/Page";
import { ListData } from "./contexts/list-data-context";
import { PresetData } from "./contexts/preset-data.context";

function App() {
  return (
    <PresetData>
      <ListData>
        <Page />
      </ListData>
    </PresetData>
  );
}

export default App;
