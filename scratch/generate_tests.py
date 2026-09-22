with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

head_style = """
<style>
.page-container { transition: none !important; }
</style>
"""

# 1. Korean keyboard
ko_script = """
<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        setSearchMode('employee');
        showPage('page-search');
    }, 800);
});
</script>
"""
ko_html = html_content.replace('</head>', head_style + '</head>').replace('</body>', ko_script + '</body>')
with open('test_kb_ko.html', 'w', encoding='utf-8') as f:
    f.write(ko_html)

# 2. English keyboard (clicked 한/영)
en_script = """
<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        setSearchMode('employee');
        showPage('page-search');
        setTimeout(function() {
            $('.btn-vk-lang').first().trigger('click');
        }, 300);
    }, 800);
});
</script>
"""
en_html = html_content.replace('</head>', head_style + '</head>').replace('</body>', en_script + '</body>')
with open('test_kb_en.html', 'w', encoding='utf-8') as f:
    f.write(en_html)

# 3. Active key test (testing #81818D)
active_script = """
<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        setSearchMode('employee');
        showPage('page-search');
        setTimeout(function() {
            $('.btn-vk-lang').first().trigger('click');
            setTimeout(function() {
                // Add .active to 'Q', SPACE, and Delete
                $('.vk-row-2 .vk-key').first().addClass('active');
                $('.btn-vk-space').first().addClass('active');
                $('.btn-vk-delete').first().addClass('active');
            }, 200);
        }, 300);
    }, 800);
});
</script>
"""
active_html = html_content.replace('</head>', head_style + '</head>').replace('</body>', active_script + '</body>')
with open('test_kb_active.html', 'w', encoding='utf-8') as f:
    f.write(active_html)

print("Generated test HTML files in root with 800ms delay.")
