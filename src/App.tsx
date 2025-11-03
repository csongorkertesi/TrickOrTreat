import { useState, useEffect } from "react";
import Address from "./Address";

export const API = "https://retoolapi.dev/w2l87p/data";

type ApiAddress = {
  id: number;
  name: string;
  location: string;
  freeFrom: string;
  hasCandy: boolean;
};

/*
<Address hasCandy={true} onOutOfCandy={()=>{}} owner="Test" address="location" hasGlutenFree={true} hasLactoseFree={false} hasSugarFree={true}></Address>
*/

export default function App() {
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then(response => response.json())
      .then((data: ApiAddress[]) => {
        if (Array.isArray(data)) {
          setAddresses(data);
        } else {
          console.error("API did not return an array:", data);
          setAddresses([]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const parseFreeFrom = (freeFrom: string | null | undefined) => {
    if (freeFrom === "none" || !freeFrom) {
      return { hasGlutenFree: false, hasLactoseFree: false, hasSugarFree: false };
    }
    const freeFromLower = freeFrom.toLowerCase();
    return {
      hasGlutenFree: freeFromLower.includes("gluten"),
      hasLactoseFree: freeFromLower.includes("lactose"),
      hasSugarFree: freeFromLower.includes("sugar")
    };
  };

  const handleOutOfCandy = (id: number) => {
    fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ hasCandy: false })
    }).then(response => {
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      //setAddresses([]);
      setIsLoading(true);
      return fetch(API)
        .then(res => res.json())
        .then((data: ApiAddress[]) => {
          if (Array.isArray(data)) {
            setAddresses(data);
          } else {
            console.error("API did not return an array:", data);
            setAddresses([]);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching data after PATCH:", error);
          setIsLoading(false);
        });
    })
      .catch(error => {
        console.error("Error updating address:", error);
      });
  };

  const numTotal = addresses.filter(addr => addr.hasCandy).length;
  const numAvailable = addresses.length;
  const numAnyFree = addresses.filter(addr => {
    if (!addr.hasCandy) return false;
    const { hasGlutenFree, hasLactoseFree, hasSugarFree } = parseFreeFrom(addr.freeFrom);
    return hasGlutenFree || hasLactoseFree || hasSugarFree;
  }).length;

  return <>
    <header>
      <h1>Trick Or Treat</h1>
    </header>
    {isLoading && (
      <div id="loadingBar">
        <div className="loadingbar1">
          Loading
        </div>
      </div>
    )}
    <Summary numTotal={numTotal} numAvailable={numAvailable} numAnyFree={numAnyFree} />
    <div id="cards">
      {[...addresses].filter(addr => addr.id != null).sort((a, b) => {
        if (a.hasCandy === b.hasCandy) return 0;
        return a.hasCandy ? -1 : 1;
      }).map(addr => {
        const { hasGlutenFree, hasLactoseFree, hasSugarFree } = parseFreeFrom(addr.freeFrom);
        return (
          <Address
            key={addr.id}
            id={addr.id}
            hasCandy={addr.hasCandy ?? false}
            onOutOfCandy={handleOutOfCandy}
            owner={addr.name ?? ""}
            address={addr.location ?? ""}
            hasGlutenFree={hasGlutenFree}
            hasLactoseFree={hasLactoseFree}
            hasSugarFree={hasSugarFree}
          />
        );
      })}
    </div>
  </>
}

type SummaryProps = {
  numTotal: number;
  numAvailable: number;
  numAnyFree: number;
};

function Summary({ numTotal, numAvailable, numAnyFree }: SummaryProps) {
  return (
    <h5 className="summary">
      Locations with candy: {numTotal}/{numAvailable}<br />
      Susceptible locations: {numAnyFree}
    </h5>
  );
}
