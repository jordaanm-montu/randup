import { ThemeProvider } from "@emotion/react";
import { Page } from "./components/Page";
import { ListData } from "./contexts/list-data-context";
import { PresetData } from "./contexts/preset-data.context";
import { createTheme } from "@mui/material";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <PresetData>
        <ListData>
          <Page />
        </ListData>
      </PresetData>
    </ThemeProvider>
  );
}

export default App;
