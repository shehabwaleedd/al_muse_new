import HeaderSkeleton from "./HeaderSkeleton";
import LowerHeader from "./LowerHeader";

import styles from "./style.module.scss"
export default function EventSkeleton() {
    return (
        <div className={`${styles["products-grid-tour"]}`}>
            <HeaderSkeleton />
            <LowerHeader />
        </div>
    )
}