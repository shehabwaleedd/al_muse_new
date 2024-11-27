import Link from "next/link";
import styles from "./page.module.scss"

export default async function NotFound() {
    return (
        <main className={styles.not_found}>
            <h1>Page Not Found</h1>
            <p>Sorry, we couldn&apos;t find the page you were looking for.</p>
            <Link href="/">
                Return Home
            </Link>
        </main>
    );
}