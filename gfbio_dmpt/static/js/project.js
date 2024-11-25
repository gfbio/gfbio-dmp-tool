/*!
    * GFBio Layout - GFBio DMP v0.0.1 (https://dmp.gfbio.dev)
    * Copyright 2021-2024 GFBio e.V.
    * Licensed under MIT
    */
    // Toggle menu
function toggleMenu() {
    document.getElementById('isToggle').classList.toggle('open');
    var isOpen = document.getElementById('navigation')
    if (isOpen.style.display === "block") {
        isOpen.style.display = "none";
    } else {
        isOpen.style.display = "block";
    }
}


// Menu sticky
function windowScroll() {
    const nav2 = document.getElementById("mainNav");
    if (nav2 != null) {
        if (
            document.body.scrollTop >= 50 ||
            document.documentElement.scrollTop >= 50
        ) {
            nav2.classList.add("navbar-shrink");
        } else {
            nav2.classList.remove("navbar-shrink");
        }
    }

    const stt = document.getElementById("scrollToTop");
    if (stt != null) {
        if (
            document.body.scrollTop >= 125 ||
            document.documentElement.scrollTop >= 125
        ) {
            stt.classList.add("visible");
            stt.classList.remove("invisible");
        } else {
            stt.classList.remove("visible");
            stt.classList.add("invisible");
        }
    }
}

window.addEventListener('scroll', (ev) => {
    ev.preventDefault();
    windowScroll();
})

//small menu
try {
    var spy = new Gumshoe('#navmenu-nav a');
} catch (err) {

}
