import { useState } from "react";
import Character from "../Character";
import Modal from "../Modal";
import styles from "./style.module.css";

const FamilyTree = ({ treeData }) => {
  const [character, setCharacter] = useState();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div
      className={styles.container}
      onClick={(e) => {
        return;
      }}
    >
      {treeData && (
        <div className={styles.nameChildWrapper}>
          <div className={styles.nameSpouseWrapper}>
            <div
              className={styles.name}
              onClick={(e) => {
                e.stopPropagation();
                setCharacter(treeData?.name);
                openModal();
              }}
            >
              <img
                src={
                  treeData.thumbImage ||
                  treeData.sigil ||
                  "http://goo.gl/vyAs27"
                }
                width={120}
                height={130}
              />
              <div className={styles.nameText}>{treeData?.name}</div>
            </div>
            {treeData?.spouse &&
              treeData?.spouse?.map((spo) => {
                console.log("Spo ", spo);
                return (
                  <div
                    className={styles.spouse}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCharacter(spo?.name);
                      openModal();
                    }}
                  >
                    <img
                      src={spo.thumbImage || treeData.sigil}
                      alt="imafdssf"
                      width={120}
                      height={130}
                    />
                    <div className={styles.nameText}>{spo.name}</div>
                  </div>
                );
              })}
          </div>
          {/* {treeData?.siblings &&
            treeData?.siblings?.map((sibling) => (
              <FamilyTree treeData={sibling} />
            ))} */}
          <div className={styles.childWrapper}>
            {treeData?.children &&
              treeData?.children?.map((child) => {
                return <FamilyTree treeData={child} />;
              })}
          </div>
        </div>
      )}
      <Modal isOpen={showModal} onClose={closeModal}>
        <Character data={character} />
      </Modal>
    </div>
  );
};

export default FamilyTree;
