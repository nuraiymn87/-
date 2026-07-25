const openBtn = document.getElementById("openBtn");
const music = document.getElementById("music");

const cover = document.getElementById("cover");
const main = document.getElementById("main");

// стартовое состояние
main.style.display = "none";

// функция открытия приглашения
openBtn.addEventListener("click", async () => {

    // показать основной блок
    cover.style.transition = "1.2s ease";
    cover.style.opacity = "0";

    setTimeout(() => {
        cover.style.display = "none";
        main.style.display = "block";

        // плавное появление main
        main.style.opacity = "0";
        main.style.transform = "translateY(30px)";

        setTimeout(() => {
            main.style.transition = "1.2s ease";
            main.style.opacity = "1";
            main.style.transform = "translateY(0)";
        }, 100);

    }, 1000);

    // музыка (важно для телефонов)
    try {
        music.currentTime = 0;
        await music.play();
    } catch (e) {
        console.log("Музыка не запустилась автоматически:", e);
    }
});


// дополнительный эффект: мягкий скролл (если появятся секции)
document.addEventListener("scroll", () => {
    const elements = document.querySelectorAll(".fade");
    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (position < screenHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
});
