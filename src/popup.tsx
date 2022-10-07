import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ConsolePage, Searcher, getSearcher } from "./search";

const Popup = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ConsolePage[]>([]);
  const [searcher, setSearcher] = useState<Searcher | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    console.log(`query: ${query}`);
    const result = searcher?.query(query, 8) ?? [];
    setResults(result);
    setSelectedIndex(0);
  }, [query, searcher]);

  useEffect(() => {
    (async () => {
      setSearcher(await getSearcher());
    })();
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("key: ", e.key);
    if (e.key === "ArrowUp") {
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    } else if (e.key === "ArrowDown") {
      setSelectedIndex(Math.min(results.length - 1, selectedIndex + 1));
    } else if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      await openSelectedPage(results[selectedIndex]);
    }
  };

  const openSelectedPage = async (p: ConsolePage) => {
    if (selectedIndex !== undefined) {
      await chrome.tabs.create({ url: p.url });
    }
  };

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
            placeholder={"GCP project ID, product"}
            style={{
              paddingLeft: "0",
              paddingRight: "0",
              height: "36px",
              outline: "none",
              border: "none",
              width: "100%",
              fontFamily: "Roboto",
              fontWeight: 400,
              letterSpacing: ".2px",
              fontSize: "14px",
              lineHeight: "20px",
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div
          style={{ borderTop: "1px solid", borderTopColor: "rgba(0,0,0,0.08)" }}
        >
          {results.map((p, i) => (
            <div
              key={i}
              style={{
                cursor: "pointer",
                minHeight: "48px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                paddingLeft: "16px",
                paddingRight: "16px",
                backgroundColor:
                  selectedIndex == i ? "rgba(0,0,0,0.04)" : "white",
              }}
              onMouseMove={() => setSelectedIndex(i)}
              onClick={() => openSelectedPage(p)}
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
