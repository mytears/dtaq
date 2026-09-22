with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add script to switch to page-search immediately
script = """
<script>
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (typeof showPage === 'function') {
            showPage('page-search');
        }
    }, 150);
});
</script>
</body>
"""
html = html.replace('</body>', script)

with open('scratch/test_search.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Created scratch/test_search.html")
