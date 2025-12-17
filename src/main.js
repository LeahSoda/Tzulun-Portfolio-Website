
//Update Date
document.getElementById('year').textContent = new Date().getFullYear();



fetch('src/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        // Load navbar.js only after navbar HTML is inserted
        const script = document.createElement('script');
        script.src = '../src/navbar.js';
        document.body.appendChild(script);
    })
    .catch(error => console.error('Error loading navbar:', error));

// Section enter scrolling animation
document.addEventListener('DOMContentLoaded', () =>{
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });
    sections.forEach(section => {
        observer.observe(section);
    });
});

//Scroll to anchor if URL has a hash
window.addEventListener('DOMContentLoaded', ()=>{
    if (window.location.hash){
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);    
        if (targetSection) {
            //Use setTimeout to ensure all rendering is done before scrolling
            setTimeout(() => {  
                    targetSection.scrollIntoView({ behavior: 'smooth'});
            }, 100); // Delay of 100ms    
        }
    }
});  

//homepage scroll
window.addEventListener('load', ()=>{

    if (!window.location.hash) {
        const element = document.getElementById('homepage');
        if (element) {
            element.scrollIntoView({ behavior: 'auto' });
        }
    }
});

