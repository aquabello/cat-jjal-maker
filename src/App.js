import React from "react";
import Title from "./components/Title";
import Form from "./components/Form";
import MainCard from "./components/MainCard";

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

function CatItem({ img }) {
  return (
    <li>
      <img src={img} style={{ width: "150px" }} />
    </li>
  );
}

function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

const App = () => {
  async function setInitialCat() {
    const firstCat = await fetchCat("first Cat");
    setMainCat(firstCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });

  // counter 변경시만 실행
  React.useEffect(() => {
    console.log("hello");
  }, [counter]);

  const [mainCat, setMainCat] = React.useState(
    "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react"
  );
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const alreadyFavorite = favorites.includes(mainCat);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);
    setCounter((prev) => {
      const nextCounter = counter + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const titleCounter = counter === null ? "" : counter + "번째";
  return (
    <div>
      <Title>{titleCounter} 고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        onHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
