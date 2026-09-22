with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

head_style = """
<style>
.page-container { transition: none !important; }
</style>
"""

typing_script = """
<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        setSearchMode('employee');
        showPage('page-search');
        setTimeout(function() {
            // 1. Switch to English
            $('.btn-vk-lang').first().trigger('click');
            
            // 2. Click 'K'
            $('.vk-key[data-key="K"]').first().trigger('click');
            // 3. Click 'I'
            $('.vk-key[data-key="I"]').first().trigger('click');
            // 4. Click 'M'
            $('.vk-key[data-key="M"]').first().trigger('click');
            // 5. Click SPACE
            $('.btn-vk-space').first().trigger('click');
            // 6. Click 'J'
            $('.vk-key[data-key="J"]').first().trigger('click');
            // 7. Click 'I'
            $('.vk-key[data-key="I"]').first().trigger('click');
            // 8. Click 'N'
            $('.vk-key[data-key="N"]').first().trigger('click');

            setTimeout(function() {
                // Take snap of input before search
                window.typedValue = $('.sync-search-input').val();
                console.log("Typed Value:", window.typedValue);
                // 9. Click search
                $('.btn-vk-search').first().trigger('click');
            }, 300);
        }, 300);
    }, 800);
});
</script>
"""

type_html = html_content.replace('</head>', head_style + '</head>').replace('</body>', typing_script + '</body>')
with open('test_kb_type.html', 'w', encoding='utf-8') as f:
    f.write(type_html)

print("Generated test_kb_type.html")
