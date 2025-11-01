import { API } from "./App";

type AddressProps = {
  id: number;
  owner: string;
  address: string;
  hasSugarFree: boolean;
  hasLactoseFree: boolean;
  hasGlutenFree: boolean;
  onOutOfCandy: (id: number) => void;
  hasCandy: boolean;
};

export default function Address({
  id,
  owner,
  address,
  hasSugarFree,
  hasLactoseFree,
  hasGlutenFree,
  onOutOfCandy,
  hasCandy
}: AddressProps) {

  return (
    <div className={hasCandy ? "card" : "card nocandy"}>
      <h3 style={{ marginBottom: "0.2em" }}>{owner} <a href="#" style={{ fontSize: "5%" }} onClick={() => {
        //! for debug only
        fetch(`${API}/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ hasCandy: true })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
            }
          })
          .catch(error => {
            console.error("Error setting hasCandy to true:", error);
          });
      }}>(debug) hasCandy</a></h3>
      <p style={{ fontSize: "1.1em", marginBottom: "1em" }}>{address}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1.2em", marginBottom: "1em", fontSize: "1.2em" }}>
        <img src="/gluten-free.png" style={{
          opacity: hasGlutenFree ? 1 : 0.2
        }} alt={(hasGlutenFree ? "has" : "hasn't got") + " gluten free candy"} title={(hasGlutenFree ? "has" : "hasn't got") + " gluten free candy"}></img>
        <img src="/sugar-free.png" style={{
          opacity: hasSugarFree ? 1 : 0.2
        }} alt={(hasSugarFree ? "has" : "hasn't got") + " sugar free candy"} title={(hasSugarFree ? "has" : "hasn't got") + " sugar free candy"}></img>
        <img className="lactoseFree" src="/dairy-free.png" style={{
          opacity: hasLactoseFree ? 1 : 0.2
        }} alt={(hasLactoseFree ? "has" : "hasn't got") + " lactose free candy"} title={(hasLactoseFree ? "has" : "hasn't got") + " lactose free candy"}></img>


      </div>
      <button
        onClick={() => { onOutOfCandy(id) }}
        style={{
          background: hasCandy ? "var(--orange-secondary)" : "var(--orange-ternary)",
          color: hasCandy ? "#fff" : "#888",
          borderRadius: "7px",
          border: "none",
          padding: "0.5em 1em",
          cursor: !hasCandy ? "not-allowed" : "pointer",
          fontWeight: "bold",
          width: "100%"
        }}
        disabled={!hasCandy}
      >
        {hasCandy ? "Out of candy?" : "Ran out!"}
      </button>
    </div>
  );
}
