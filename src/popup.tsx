import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ConsolePage, Searcher, getSearcher } from "./search";

const Popup = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ConsolePage[]>([]);
  const [searcher, setSearcher] = useState<Searcher | undefined>(undefined);

  useEffect(() => {
    console.log(`query: ${query}`);
    const results = searcher?.query(query) ?? [];
    setResults(results);
  }, [query, searcher]);

  useEffect(() => {
    (async () => {
      setSearcher(await getSearcher());
    })();
  }, []);

  return (
    <>
      <input
        onChange={(e) => setQuery(e.target.value)}
        type={"text"}
        autoFocus={true}
        style={{ minWidth: "400px" }}
      />
      {results.map((p, i) => (
        <div key={i}>
          {p.projectId} {p.name} {p.url}
        </div>
      ))}
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
