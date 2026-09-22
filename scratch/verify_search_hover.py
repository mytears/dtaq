with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

head_style = '<style>.page-container { transition: none !important; }</style>'
script = '''<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        showPage('page-search');
        setTimeout(function() {
            $('.btn-vk-search').first().addClass('active');
            $('.vk-row-2 .vk-key').first().addClass('active');
        }, 100);
    }, 300);
});
</script>'''

c = c.replace('</head>', head_style + '</head>').replace('</body>', script + '</body>')
with open('test_search_hover.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Created test_search_hover.html with 300ms/100ms timing")
