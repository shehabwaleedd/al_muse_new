'use client'
import { useEffect } from "react";
import { animatePageOut } from "@/animation/animatePageOut";
import styles from "./page.module.scss";
import { usePathname } from "next/navigation";


export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    useEffect(() => {
        animatePageOut();
    }, [pathname]);


    return (
        <div>
            <div id="banner-1" className={styles.banner1}></div>
            {children}
        </div>
    );
}
