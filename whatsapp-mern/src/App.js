// import logo from './logo.svg';
// import React from "react";
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';

function App() {

  useEffect(() => {
    // Pusher.logToConsole = true;

    var pusher = new Pusher('499e30148139eddda3dd', {
      cluster: 'ap2'
    });

    var channel = pusher.subscribe('messages');
    channel.bind('my-event', function(data) => {
      alert(JSON.stringify(data));
    })
  }, [input])

  return (
    <div className="App">
      <div className="app__body">
        <Sidebar />
        <Chat />
      </div>      
    </div>
  );
}

export default App;
