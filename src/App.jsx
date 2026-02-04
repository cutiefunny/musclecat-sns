import { Router, Route } from "@solidjs/router";
// 기존 컴포넌트들...
import Feed from "./pages/Feed"; 

function App() {
  return (
    <Router>
      <Route path="/" component={Feed} />
    </Router>
  );
}

export default App;