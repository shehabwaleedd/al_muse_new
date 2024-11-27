import styles from "./style.module.scss";
export default function Skeleton() {
    return (
        <div className={styles.products_grid}>
            {
                [...new Array(10)].map((p, index) => (
                    <article key={index} className={styles.skeleton_card}>
                        <div className={`${styles.skeleton} ${styles.skeleton_card_img}`}>
                        </div>
                        <div className={`${styles.skeleton_card_text}`}>
                            <h2 className={`${styles.skeleton} ${styles.skeleton_card_title}`}></h2>
                            <h4 className={`${styles.skeleton} ${styles.skeleton_card_brand}`}></h4>
                            <div>
                                <p className={`${styles.skeleton} ${styles.skeleton_card_description}`}></p>
                                <p className={`${styles.skeleton} ${styles.skeleton_card_description}`}></p>
                                <p className={`${styles.skeleton} ${styles.skeleton_card_description}`}></p>
                            </div>
                        </div>
                    </article>
                ))
            }
        </div>
    )
}