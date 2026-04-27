document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.image-gallery').forEach(function (gallery) {
    if (gallery.closest('.image-gallery-shell')) return;

    var shell = document.createElement('div');
    shell.className = 'image-gallery-shell';
    gallery.parentNode.insertBefore(shell, gallery);
    shell.appendChild(gallery);

    var previous = document.createElement('button');
    previous.className = 'image-gallery-button previous';
    previous.type = 'button';
    previous.setAttribute('aria-label', 'Previous gallery image');
    previous.textContent = '<';

    var next = document.createElement('button');
    next.className = 'image-gallery-button next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next gallery image');
    next.textContent = '>';

    shell.appendChild(previous);
    shell.appendChild(next);

    function getStep() {
      var firstItem = gallery.querySelector('figure, img');
      return firstItem ? firstItem.getBoundingClientRect().width + 16 : gallery.clientWidth * 0.85;
    }

    function updateButtons() {
      var maxScroll = gallery.scrollWidth - gallery.clientWidth - 2;
      previous.disabled = gallery.scrollLeft <= 2;
      next.disabled = gallery.scrollLeft >= maxScroll;
    }

    previous.addEventListener('click', function () {
      gallery.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });

    next.addEventListener('click', function () {
      gallery.scrollBy({ left: getStep(), behavior: 'smooth' });
    });

    gallery.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
  });
});
