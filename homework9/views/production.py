fin = open('index.html', 'r')
fout = open('ans.txt', 'w')
for line in fin.readlines():
    fout.write("response.write('" + line.strip('\n') + "\\n');\n");
fin.close()
fout.close()
