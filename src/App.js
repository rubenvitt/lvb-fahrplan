import React from 'react';
import './App.css';
import Station from './components/Station';
import Header from './components/Header';
import Menu from './components/Menu';

function App() {
    //const station = new Components(null);
    return (
        <div className="App">
            <Header />
            <div id="container">
                <Menu />
                <main className="App-content">
                    <div id="results">
                        <Station query="markt" />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
