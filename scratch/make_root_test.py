with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

override = """
<style>.page-container { transition: none !important; }</style>
<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        showPage('page-search');
    }, 300);
});
</script>
</head>
"""
html = html.replace('</head>', override)

with open('test_search_root.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Created test_search_root.html")
