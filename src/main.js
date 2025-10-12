
//Update Date
document.getElementById('year').textContent = new Date().getFullYear();

// folding menu
const menuButton = document.getElementById('menu-button');
const sidebar = document.getElementById('sidebar');
const links = document.querySelectorAll('#sidebar a')


// Side bar menu - open/close
menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});


//close sidebar when clicking outside of it
links.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('show');
    });
});

// Close sidebar when clicking outside of it
document.addEventListener('click', (e) => {
    // Check if the click is outside the sidebar
    if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
        sidebar.classList.remove('show');
    }
});

// scroll + close sidebar aftter clicking a link
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // prevent default anchor behavior
        sidebar.classList.remove('show');

        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});



// Section enter scolling animaiton
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.6
});


sections.forEach(section => {
    observer.observe(section);
});

//homepage
window.addEventListener('load', function () {
    const element = document.getElementById('homepage');
    element.scrollIntoView({ behavior: 'auto' });
});
