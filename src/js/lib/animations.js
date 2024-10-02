export const animateTranslateYOpacity = {
    keyframes: [
        {
            transform: "translateY(20px)",
            opacity: "0",
        },
        {
            transform: "translateY(0px)",
            opacity: "1",
        }
    ],
    options: {
        duration: 300,
        fill: "forwards",
        easing: "ease-in-out",
    }
}