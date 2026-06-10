
// ============================================
// Contact form handler (contact__v2)
// Robust init: run immediately if DOM is ready, or wait for DOMContentLoaded
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (!contactForm) {
        console.log("Form not found");
        return;
    }

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // ✅ VERY IMPORTANT
        const name = (document.getElementById('name') || {}).value || '';
        const email = (document.getElementById('email') || {}).value || '';
        const message = (document.getElementById('message') || {}).value || '';

        if (!name.trim() || !email.trim() || !message.trim()) {
            if (errorMessage) {
                errorMessage.textContent = 'Please fill all fields';
                errorMessage.style.display = 'block';
            }
            return;
        }

        const submitBtn = contactForm.querySelector('input[type="submit"]');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.value = 'Sending...';
        }
        if (successMessage) {
                successMessage.textContent = 'Message sent!';
                successMessage.classList.remove("d-none");
                successMessage.style.display = "block";

            }
            if(errorMessage){
                errorMessage.classList.add("d-none");
                errorMessage.style.display = "none";
            }

        setTimeout(() => {
             if (successMessage) {
                successMessage.textContent = 'Message sent!';
                successMessage.classList.add("d-none");
                successMessage.style.display = "none";

            }
            

            contactForm.reset();
            
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.value = 'Send';
                
            }
        }, 5000);
    });

});






// ✅ SCROLL DETECTION
const section = document.getElementById("stats");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      // ✅ DELAY
      setTimeout(() => {
        document.querySelectorAll(".counter").forEach(el => {
          let target = parseInt(el.getAttribute("data-target"));
          animateCounter(el, target);
        });
      }, 500);

      observer.unobserve(section); // run once only ✅
    }
  });
}, { threshold: 0.5 });

observer.observe(section);


// ✅ Counter function
function animateCounter(el, target) {
  let start = null;
  let duration = 2000;

  function update(time) {
    if (!start) start = time;

    let progress = Math.min((time - start) / duration, 1);
    let value = Math.floor(progress * target);

    el.innerText = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.innerText = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}
