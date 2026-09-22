with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

head_style = '<style>.page-container { transition: none !important; }</style>'

# 1. Test A-5: List view without keyboard
script_a5 = '''<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        setSearchMode('employee');
        executeSearch();
    }, 500);
});
</script>'''
html_a5 = html.replace('</head>', head_style + '</head>').replace('</body>', script_a5 + '</body>')
with open('test_list_a5.html', 'w', encoding='utf-8') as f:
    f.write(html_a5)

# 2. Test A-4: List view with keyboard overlay
script_a4 = '''<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        setSearchMode('employee');
        executeSearch();
        setTimeout(function() {
            $('#list-vk-modal').show();
        }, 150);
    }, 500);
});
</script>'''
html_a4 = html.replace('</head>', head_style + '</head>').replace('</body>', script_a4 + '</body>')
with open('test_list_a4.html', 'w', encoding='utf-8') as f:
    f.write(html_a4)

print("Generated test_list_a5.html and test_list_a4.html")
