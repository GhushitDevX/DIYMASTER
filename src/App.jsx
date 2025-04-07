import { Routes, Route } from "react-router-dom";
import UserValidation from "./components/UserValidation";

import Home from "./components/Home";

function App() {
  return (
    <Routes>
      <Route path='/' element={<UserValidation />} />
      <Route path='/Home' element={<Home />} />
    </Routes>
  );
}

export default App;
