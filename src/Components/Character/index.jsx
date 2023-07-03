import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./style.module.css";

const Character = ({ data }) => {
  const [characterData, setCharacterData] = useState();
  useEffect(() => {
    // setCharacterData(data);
    console.log("use");
    getCharUsingName(data)
      .then((res) => setCharacterData(res))
      .catch((err) => console.log("Error ", err));
  }, []);

  const getCharUsingName = async (name) => {
    const newSpo = name.replace(/(\r\n|\n|\r)/gm, "");
    const result = await axios({
      method: "GET",
      url: `http://localhost:8080/getCharUsingName/${newSpo}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data[0];
  };

  console.log(characterData);
  return (
    <div className={styles.container}>
      {characterData ? (
        <div className={styles.characterInfo}>
          <div className={styles.imageWrapper}>
            <img
              src={characterData?.characterImageFull}
              alt={characterData.characterName}
            />
          </div>
          <div className={styles.charData}>
            <h2>{characterData.characterName}</h2>

            <p>
              <strong>House Name : </strong> {characterData.houseName}
            </p>
            <p>
              <strong>Actor Name : </strong> {characterData.actorName}
            </p>
            <p>
              <strong>Royal:</strong> {characterData.royal ? "Yes" : "No"}
            </p>
            <p>
              <strong>Siblings:</strong>{" "}
              {characterData.siblings && characterData.siblings.join(", ")}
            </p>
            <p>
              <strong>Killed:</strong>{" "}
              {characterData.killed && characterData.killed.join(", ")}
            </p>
            <p>
              <strong>Married/Engaged:</strong>{" "}
              {characterData.marriedEngaged &&
                characterData.marriedEngaged.join(", ")}
            </p>
            <p>
              <strong>Killed By:</strong>{" "}
              {characterData.killedBy && characterData.killedBy.join(", ")}
            </p>
            <p>
              <strong>Parents:</strong>{" "}
              {characterData.parents && characterData.parents.join(", ")}
            </p>
            <p>
              <strong>Guarded By:</strong>{" "}
              {characterData.guardedBy && characterData.guardedBy.join(", ")}
            </p>
            <button onClick={() => {}}>Mark Favourite</button>
          </div>
        </div>
      ) : (
        "no data found"
      )}
    </div>
  );
};

export default Character;
