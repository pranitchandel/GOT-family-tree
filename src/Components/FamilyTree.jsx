import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

const FamilyTree = ({ treeData }) => {
  return (
    <div className={styles.container}>
      {treeData && (
        <div className={styles.nameChildWrapper}>
          <div className={styles.nameSpouseWrapper}>
            <div
              className={styles.name}
              //   style={{
              //     minWidth: `${count * 20}px`,
              //     // minWidth: "200px",
              //     border: "2px solid yellow",
              //   }}
            >
              <img
                src={treeData.thumbImage || treeData.sigil}
                alt="imafdssf"
                width={100}
                height={120}
              />
              <div>{treeData?.name}</div>
            </div>
            {console.log(treeData?.spouse)}
            {treeData?.spouse &&
              treeData?.spouse?.map((spo) => {
                return (
                  <div className={styles.spouse}>
                    <img
                      src={spo.thumbImage || treeData.sigil}
                      alt="imafdssf"
                      width={100}
                      height={120}
                    />
                    <div>{spo.name}</div>
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
              treeData?.children?.map((child) => (
                <FamilyTree treeData={child} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTree;
