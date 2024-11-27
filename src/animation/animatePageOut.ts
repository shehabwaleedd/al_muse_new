import gsap from "gsap";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const animatePageOut = () => {
    const bannerOne = document.getElementById("banner-1");
    if (bannerOne) {
        const tl = gsap.timeline();

        tl.to(".letter1", {
            opacity: 0,
        })

        .set(bannerOne, {
            display: "block",
            opacity: 1,
        })
        .to(bannerOne, {
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(bannerOne, { display: "none" });
            }
        });
    }
};

export const animatePageIn = (href: string, router: AppRouterInstance) => {
    const bannerOne = document.getElementById("banner-1");

    if (bannerOne) {
        const tl = gsap.timeline({
            onComplete: () => {
                router.push(href);
            }
        });

        tl.set(bannerOne, {
            display: "block",
            opacity: 0,
        })
        .to(bannerOne, {
            opacity: 1,
            duration: 1,
            ease: "power2.inOut",
        })
        .set(".letter1", {
            opacity: 1,
        });
    }
};
