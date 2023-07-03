import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import FamilyTree from "./Components/FamilyTree";
import icon from "file:///Users/pranitkumarchandel/Downloads/Game-of-Thrones-01/Game-of-Thrones-01.svg";
import martell from "./assets/martell.jpg";
import tully from "./assets/tully.jpg";
import lanni from "./assets/lanni.jpg";
import bara from "./assets/bara.jpg";
import targ from "./assets/targ.jpg";
import tyrell from "./assets/tyrell.jpg";
import stark from "./assets/stark.jpg";
import greyjoy from "./assets/greyjoy.jpg";

function App() {
  const [temp, setTemp] = useState(null);
  const [houseList, setHouseList] = useState([]);
  const [currentHouse, setCurrentHouse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const rootMap = {
    Stark: {
      name: "Rickard Stark",
      backgroundColor: "#808080",
      backgroundImage: stark,
      sigil:
        "https://www.freelogoservices.com/blog/wp-content/uploads/House_Stark.svg_.png",
    },
    Lannister: {
      name: "Tywin Lannister",
      backgroundColor: "#c00909",
      backgroundImage: lanni,
      sigil:
        "https://www.freelogoservices.com/blog/wp-content/uploads/House_Lannister.svg_.png",
    },
    Tyrell: {
      name: "Olenna Tyrell",
      backgroundColor: "#1b8f1c",
      backgroundImage: tyrell,
      sigil:
        "https://www.freelogoservices.com/blog/wp-content/uploads/House_Tyrell.svg_.png",
    },
    Arryn: {
      name: "Hoster Tully",
      sigil:
        "https://www.freelogoservices.com/blog/wp-content/uploads/House_Arryn.svg-1.png",
    },
    Frey: "Walder Frey",
    Martell: {
      name: "Doran Martell",
      backgroundColor: "#f38d1a",
      backgroundImage: martell,
      sigil:
        "https://www.freelogoservices.com/blog/wp-content/uploads/House_Martell.svg_.png",
    },
    Mormont: "Jeor Mormont",
    Tully: {
      name: "Hoster Tully",
      backgroundColor: "#1111b5",
      backgroundImage: tully,
      sigil:
        "https://awoiaf.westeros.org/thumb.php?f=House_Tully.svg&width=545&lang=en",
    },
    Umber: "Ned Umber",
    Greyjoy: {
      name: "Balon Greyjoy",
      backgroundColor: "#f0c311",
      backgroundImage: greyjoy,
      sigil:
        "https://www.freelogoservices.com/blog/wp-content/uploads/House_Greyjoy.svg_.png",
    },
    Targaryen: {
      name: "Aerys II Targaryen",
      backgroundColor: "#811414",
      backgroundImage: targ,
      sigil:
        "https://www.freelogoservices.com/blog/wp-content/uploads/House_Targaryen.svg_.png",
    },
    Tarly: "Randyll Tarly",
    Baratheon: {
      name: "Robert Baratheon",
      backgroundColor: "#edcf0c",
      backgroundImage: bara,
      sigil:
        "https://www.freelogoservices.com/blog/wp-content/uploads/House_Baratheon.svg_.png",
    },
    Bolton: "Roose Bolton",
  };

  useEffect(() => {
    getHouseList();
  }, []);

  useEffect(() => {
    if (houseList.length > 0 && currentHouse) {
      getAllCharactersOfHouse();
    }
  }, [houseList, currentHouse]);

  const getHouseList = async () => {
    axios({
      method: "GET",
      url: "http://localhost:8080/getHouseList",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => setHouseList(res.data))
      .catch((err) => console.log("Errro ", err));
  };

  const getCharUsingName = async (name) => {
    const newSpo = name.replace(/(\r\n|\n|\r)/gm, "");
    const result = await axios({
      method: "GET",
      url: `http://localhost:8080/getCharUsingName/${newSpo}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  };

  const getAllCharactersOfHouse = async () => {
    const response = await axios({
      method: "GET",
      url: `http://localhost:8080/getCharUsingHouse/${currentHouse}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const root = getRootCharacter(response.data);
    const familyTreeData = getFamilyTree(
      rootMap[currentHouse].name,
      response.data
    ).then((res) => {
      setTemp({ data: res });
    });
  };
  const getFamilyTree = async (root, characters, processed = new Set()) => {
    setLoading(true);
    const rootObj = characters.find((char) => char.characterName === root);
    if (
      !rootObj ||
      Object.keys(rootObj).length === 0 ||
      processed.has(rootObj.characterName)
    ) {
      return null;
    }

    processed.add(rootObj.characterName);

    const data = {
      name: rootObj.characterName,
      thumbImage: rootObj.characterImageFull,
    };

    if (rootObj.marriedEngaged) {
      const res = await Promise.all(
        rootObj.marriedEngaged.map(async (spo) => {
          const res = await getCharUsingName(spo);
          return {
            name: res[0].characterName,
            thumbImage: res[0].characterImageFull,
          };
        })
      );
      data.spouse = [...res];
    }
    if (rootObj.siblings) {
      data.siblings = [
        ...rootObj.siblings.map((sib) => {
          return { name: sib };
        }),
      ];
      // for (let sibling of rootObj.siblings) {
      //   const siblingData = getFamilyTree(sibling, characters, processed);
      //   if (siblingData) {
      //     data.siblings.push(siblingData);
      //   }
      // }
    }

    if (rootObj.parentOf) {
      data.children = [];
      for (let child of rootObj.parentOf) {
        const childData = await getFamilyTree(child, characters, processed);
        if (childData) {
          data.children.push(childData);
        } else {
          console.log("res ");
          const res = await getCharUsingName(child);
          data.children = [
            ...data.children,
            {
              name: res[0].characterName,
              thumbImage: res[0].characterImageFull,
            },
          ];
        }
      }
    }
    data.sigil = rootMap[currentHouse].backgroundImage;
    setLoading(false);
    return data;
  };

  const getRootCharacter = (characters) => {
    for (let character of characters) {
      if (character.parents) {
        continue;
      } else {
        let hasParent = false;
        for (let characterIn of characters) {
          if (
            characterIn.parentOf &&
            characterIn.parentOf.includes(character.characterName)
          ) {
            hasParent = true;
            break;
          }
        }
        if (!hasParent) return character;
      }
    }
  };

  const houses = houseList.map((house, index) => (
    <li
      onClick={(e) => {
        e.stopPropagation();
        setCurrentHouse(house);
        setShowDropdown(!showDropdown);
      }}
    >
      {house}
    </li>
  ));

  return (
    <div
      className="App"
      style={
        {
          // backgroundColor: rootMap[currentHouse]?.backgroundColor || "#fff",
          // backgroundImage: `url(${rootMap[currentHouse]?.backgroundImage})`,
          // backgroundPosition: "center" /* Center the image */,
          // backgroundRepeat: "no-repeat" /* Do not repeat the image */,
          // backgroundSize: "cover",
          // backgroundBlendMode: "luminosity",
        }
      }
    >
      <div className="logo">
        GAME <span>OF</span> THRONES
      </div>
      <div className="selectWrapper">
        <div className="searchSelectContainer">
          <span>Select House</span>
          <div
            className="searchDropdown"
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
          >
            {currentHouse ? (
              <span>{currentHouse}</span>
            ) : (
              <span className="disabledCategory">Category</span>
            )}
            {/* <img
              src={icons.arrowDown}
              alt=""
              className={`arrowImage ${showDropdown && "arrowImageUp"}`}
            /> */}
          </div>
          {showDropdown && <ul className="searchOptions">{houses}</ul>}
        </div>
      </div>
      <div style={{ marginTop: "100px" }}>
        <FamilyTree treeData={temp?.data} />
      </div>
    </div>
  );
}

export default App;
