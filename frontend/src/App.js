
import './App.css';
import {Route} from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatspage from './Pages/Chatspage';

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact/>
      <Route path="/chats" component={Chatspage}/>
    </div>
  );
}

export default App;
