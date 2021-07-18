import MasterLayout from "./components/layouts/MasterLayout";
import RootRoute from "./routes";
import "./styles/index.scss";

function App() {
  return (
    <MasterLayout>
      <RootRoute />
    </MasterLayout>
  );
}

export default App;
