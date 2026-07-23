import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ExecutiveReport from "./pages/ExecutiveReport";
import Architecture from "./pages/Architecture";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/executive-report"
          element={<ExecutiveReport />}
        />
        <Route
          path="/architecture"
          element={<Architecture />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;