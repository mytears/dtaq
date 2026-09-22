with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

head_style = '<style>.page-container { transition: none !important; }</style>'

script_detail = '''<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        setSearchMode('employee');
        selectEmployee('261010');
    }, 400);
});
</script>'''

html_detail = html.replace('</head>', head_style + '</head>').replace('</body>', script_detail + '</body>')
with open('test_detail.html', 'w', encoding='utf-8') as f:
    f.write(html_detail)

print("Created test_detail.html")
