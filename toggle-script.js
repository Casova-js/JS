document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript loaded");
    const toggleCheckbox = document.getElementById('toggle-checkbox');
    const xczqdYZJmV = document.getElementById('section-xczqdYZJmV');
    const E3Rs8XyMZm = document.getElementById('section-E3Rs8XyMZm');

    // Kontrollera att elementen finns innan vi fortsätter
    if (!toggleCheckbox || !xczqdYZJmV || !E3Rs8XyMZm) {
        console.error("Ett eller flera element kunde inte hittas. Kontrollera att id:n stämmer.");
        return;
    }

    // Lyssna på förändringar på togglen
    toggleCheckbox.addEventListener('change', function() {
        console.log("Toggle changed, current checked state:", this.checked);
        if (this.checked) {
            xczqdYZJmV.style.display = 'none';
            E3Rs8XyMZm.style.display = 'block';
        } else {
            E3Rs8XyMZm.style.display = 'none';
            xczqdYZJmV.style.display = 'block';
        }
    });

    // Initial visning beroende på toggle-läget vid sidladdning
    if (toggleCheckbox.checked) {
        xczqdYZJmV.style.display = 'none';
        E3Rs8XyMZm.style.display = 'block';
    } else {
        E3Rs8XyMZm.style.display = 'none';
        xczqdYZJmV.style.display = 'block';
    }
});
