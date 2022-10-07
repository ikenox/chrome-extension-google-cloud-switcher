import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ConsolePage, Searcher, getSearcher } from "./search";

const Popup = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ConsolePage[]>([]);
  const [searcher, setSearcher] = useState<Searcher | undefined>(undefined);

  useEffect(() => {
    console.log(`query: ${query}`);
    setResults(searcher?.query(query, 5) ?? []);
  }, [query, searcher]);

  useEffect(() => {
    (async () => {
      setSearcher(await getSearcher());
    })();
  }, []);

  return (
    <>
      <div
        style={{
          width: "500px",
          fontFamily: "Roboto",
          letterSpacing: ".3px",
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 400,
          color: "#202124",
        }}
      >
        <div
          style={{
            marginLeft: "16px",
            marginRight: "16px",
          }}
        >
          <input
            onChange={(e) => setQuery(e.target.value)}
            type={"text"}
            autoFocus={true}
            placeholder={"GCP project ID and/or GCP Product name"}
            style={{
              paddingLeft: "0",
              paddingRight: "0",
              height: "36px",
              outline: "none",
              border: "none",
              width: "100%",
              fontFamily: "Roboto",
              letterSpacing: ".2px",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          />
        </div>
        <div
          style={{ borderTop: "1px solid", borderTopColor: "rgba(0,0,0,0.08)" }}
        >
          {results.map((p, i) => (
            <div
              key={i}
              style={{
                minHeight: "48px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            >
              <div
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  letterSpacing: ".2px",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  color: "#5f6368",
                }}
              >
                {p.projectId}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
