import cgi

form = cgi.FieldStorage()
msg = form.getvalue('Message')
print(msg)
for keys in form.keys():
    print("Content-type: text/html")
    print('''
    <html>
<head></head>
<body>
<script>
    alert("''' + "{0} => {1}".format(str(keys), str(form[keys])) +
          ''''");
</script>
</body>
</html>
    ''')
