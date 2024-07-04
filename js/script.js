function updateLineNumbers() {
    const input = document.getElementById('Input');
    const lines = input.value.split('\n').length;
    const lineNumbers = document.getElementById('lineNumbers');
    lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => (i + 1).toString().padStart(2, '0')).join('<br>');
}

function syncScroll() {
    const input = document.getElementById('Input');
    const lineNumbers = document.getElementById('lineNumbers');
    lineNumbers.scrollTop = input.scrollTop;
}