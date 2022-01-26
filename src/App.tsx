import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Anniversary } from "./entities/anniversary";
import * as funniversaries from "funniversaries";

function App() {
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);

  React.useEffect(() => {
    async function execute() {
      const a = await funniversaries.generate_anniversaries(
        "2020-01-02T03:04:05.006Z"
      );
      console.log("js");
      console.log(a);
      setAnniversaries(a);
    }

    void execute();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          {anniversaries.map((a) => (
            <li>
              {a.date}: {a.name} {a.count} {a.unit}
            </li>
          ))}
        </a>
      </header>
    </div>
  );
}

export default App;
