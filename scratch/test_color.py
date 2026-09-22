with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

head_style = '<style>.page-container { transition: none !important; }</style>'
script = '''<script>
window.addEventListener('load', function() {
    setTimeout(function() {
        showPage('page-search');
        var btn = document.querySelector('.vk-key.btn-vk-search');
        btn.classList.add('active');
        var color = window.getComputedStyle(btn).backgroundColor;
        document.title = 'COLOR:' + color;
    }, 500);
});
</script>'''

c = c.replace('</head>', head_style + '</head>').replace('</body>', script + '</body>')
with open('test_color.html', 'w', encoding='utf-8') as f:
    f.write(c)
